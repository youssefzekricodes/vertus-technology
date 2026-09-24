"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/**
 * Procedural solar scene: fbm-noise sun, instanced photovoltaic field,
 * and particles streaming from the sun down onto the panels.
 * `quality` trims particle and instance counts on small/low-end devices.
 */

const SUN_POS = new THREE.Vector3(0, 2.4, -16);

const sunVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;

  // hash + 3d value noise + fbm — cheap procedural plasma
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPos);
    float n = fbm(p * 3.0 + vec3(0.0, uTime * 0.05, uTime * 0.08));
    float n2 = fbm(p * 7.0 - uTime * 0.06);
    float plasma = smoothstep(0.25, 0.85, n * 0.7 + n2 * 0.45);

    vec3 deep = vec3(0.55, 0.18, 0.02);
    vec3 mid  = vec3(0.94, 0.55, 0.08);
    vec3 hot  = vec3(1.0, 0.86, 0.45);
    vec3 col = mix(deep, mid, plasma);
    col = mix(col, hot, smoothstep(0.6, 1.0, plasma));

    // limb darkening + rim
    float facing = dot(vNormal, vec3(0.0, 0.0, 1.0));
    col *= 0.55 + 0.45 * smoothstep(-0.2, 0.9, facing);
    col += vec3(1.0, 0.75, 0.35) * pow(1.0 - clamp(facing, 0.0, 1.0), 2.0) * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 2.2) * 0.85;
    gl_FragColor = vec4(1.0, 0.72, 0.28, a);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  attribute vec3 aStart;
  attribute vec3 aEnd;
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  varying float vFade;
  void main() {
    float t = fract(uTime * aSpeed + aOffset);
    vec3 pos = mix(aStart, aEnd, t);
    pos.y += sin(t * 3.14159) * 2.2;         // arc
    pos.x += sin((t + aOffset) * 12.0) * 0.08; // shimmer
    vFade = sin(t * 3.14159);                  // fade in/out at ends
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (60.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const particleFragment = /* glsl */ `
  varying float vFade;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vFade * 0.9;
    gl_FragColor = vec4(1.0, 0.78, 0.32, a);
  }
`;

function Sun() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <group position={SUN_POS}>
      <mesh>
        <sphereGeometry args={[4.6, 48, 48]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={sunVertex}
          fragmentShader={sunFragment}
        />
      </mesh>
      <mesh scale={[16, 16, 1]}>
        <planeGeometry />
        <shaderMaterial
          vertexShader={glowVertex}
          fragmentShader={glowFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

const PANEL_W = 2.2;
const PANEL_H = 1.3;
const PANEL_TILT = -1.0;
const GROUND_Y = -2.7;

type Panel = { matrix: THREE.Matrix4; position: THREE.Vector3; quaternion: THREE.Quaternion };

function panelLayout(rows: number, cols: number): Panel[] {
  const dummy = new THREE.Object3D();
  const out: Panel[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dummy.position.set((c - (cols - 1) / 2) * 2.45, -1.95, 1.4 - r * 2.4);
      dummy.rotation.set(PANEL_TILT, 0, 0);
      dummy.updateMatrix();
      out.push({
        matrix: dummy.matrix.clone(),
        position: dummy.position.clone(),
        quaternion: dummy.quaternion.clone(),
      });
    }
  }
  return out;
}

/** Random points on the panels' glass, so energy visibly lands on them. */
function panelTargets(layout: Panel[], count: number): THREE.Vector3[] {
  return Array.from({ length: count }, () => {
    const p = layout[Math.floor(Math.random() * layout.length)];
    return new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(PANEL_W * 0.9),
      THREE.MathUtils.randFloatSpread(PANEL_H * 0.9),
      0.05
    )
      .applyQuaternion(p.quaternion)
      .add(p.position);
  });
}

function Particles({ count, layout }: { count: number; layout: Panel[] }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const start = new Float32Array(count * 3);
    const end = new Float32Array(count * 3);
    const offset = new Float32Array(count);
    const speed = new Float32Array(count);
    const size = new Float32Array(count);
    const ends = panelTargets(layout, count);
    for (let i = 0; i < count; i++) {
      // start: random point on the sun's front hemisphere
      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1.6),
        THREE.MathUtils.randFloatSpread(1.6),
        Math.random() * 0.9 + 0.3
      ).normalize();
      const s = SUN_POS.clone().addScaledVector(dir, 4.7);
      start.set([s.x, s.y, s.z], i * 3);
      end.set([ends[i].x, ends[i].y, ends[i].z], i * 3);
      offset[i] = Math.random();
      speed[i] = THREE.MathUtils.randFloat(0.05, 0.12);
      size[i] = THREE.MathUtils.randFloat(0.5, 1.4);
    }
    g.setAttribute("position", new THREE.BufferAttribute(start.slice(), 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(offset, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count, layout]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Monocrystalline cell pattern: blue cells, light gaps, fine busbars. */
function makeCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const g = canvas.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 512, 320);
  grad.addColorStop(0, "#2d5fa3");
  grad.addColorStop(0.5, "#1a4178");
  grad.addColorStop(1, "#0f2a55");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 320);

  const cols = 10;
  const rows = 6;
  const cw = 512 / cols;
  const ch = 320 / rows;
  g.strokeStyle = "rgba(210,225,245,0.28)";
  g.lineWidth = 1.2;
  for (let j = 0; j < rows; j++) {
    for (const f of [0.33, 0.66]) {
      g.beginPath();
      g.moveTo(0, ch * (j + f));
      g.lineTo(512, ch * (j + f));
      g.stroke();
    }
  }
  g.strokeStyle = "rgba(215,230,250,0.7)";
  g.lineWidth = 3;
  for (let i = 1; i < cols; i++) {
    g.beginPath();
    g.moveTo(i * cw, 0);
    g.lineTo(i * cw, 320);
    g.stroke();
  }
  for (let j = 1; j < rows; j++) {
    g.beginPath();
    g.moveTo(0, j * ch);
    g.lineTo(512, j * ch);
    g.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Instanced({ matrices, children }: { matrices: THREE.Matrix4[]; children: React.ReactNode }) {
  const setRef = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      if (!mesh) return;
      matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    },
    [matrices]
  );
  return (
    <instancedMesh ref={setRef} args={[undefined, undefined, matrices.length]}>
      {children}
    </instancedMesh>
  );
}

function PanelField({ layout }: { layout: Panel[] }) {
  const texture = useMemo(() => makeCellTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);

  const { frames, faces, legs } = useMemo(() => {
    const lift = new THREE.Matrix4().makeTranslation(0, 0, 0.04);
    const legMatrices: THREE.Matrix4[] = [];
    for (const p of layout) {
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          // Leg runs from the ground up to the panel's underside edge.
          const top = new THREE.Vector3(sx * (PANEL_W / 2 - 0.3), sy * (PANEL_H / 2 - 0.12), -0.04)
            .applyQuaternion(p.quaternion)
            .add(p.position);
          const h = top.y - GROUND_Y;
          legMatrices.push(
            new THREE.Matrix4().compose(
              new THREE.Vector3(top.x, GROUND_Y + h / 2, top.z),
              new THREE.Quaternion(),
              new THREE.Vector3(1, h, 1)
            )
          );
        }
      }
    }
    return {
      frames: layout.map((p) => p.matrix),
      faces: layout.map((p) => p.matrix.clone().multiply(lift)),
      legs: legMatrices,
    };
  }, [layout]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, -6]}>
        <planeGeometry args={[70, 40]} />
        <meshStandardMaterial color="#0d1013" roughness={1} />
      </mesh>
      <Instanced matrices={legs}>
        <boxGeometry args={[0.07, 1, 0.07]} />
        <meshStandardMaterial color="#8d949c" metalness={0.7} roughness={0.45} />
      </Instanced>
      <Instanced matrices={frames}>
        <boxGeometry args={[PANEL_W, PANEL_H, 0.07]} />
        <meshStandardMaterial color="#cfd4da" metalness={0.8} roughness={0.3} />
      </Instanced>
      <Instanced matrices={faces}>
        <planeGeometry args={[PANEL_W - 0.1, PANEL_H - 0.1]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.22}
          metalness={0.45}
          roughness={0.3}
        />
      </Instanced>
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const scroll = useRef(0);
  useFrame(() => {
    if (typeof window !== "undefined") {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    }
    const tx = pointer.x * 0.45;
    const ty = 1.1 + pointer.y * 0.25 - scroll.current * 1.4;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, 0.6 - scroll.current, -6);
  });
  return null;
}

export default function Hero3D({ quality }: { quality: "high" | "low" }) {
  const particles = quality === "high" ? 700 : 220;
  const layout = useMemo(
    () => (quality === "high" ? panelLayout(3, 5) : panelLayout(2, 3)),
    [quality]
  );
  return (
    <Canvas
      camera={{ position: [0, 1.1, 8.5], fov: 50 }}
      dpr={quality === "high" ? [1, 2] : 1}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      frameloop="always"
    >
      <fog attach="fog" args={["#101214", 14, 34]} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#b9c9e0", "#1a1410", 0.5]} />
      {/* sun rim from behind, a front key so the glass face reads, and a high
          warm light placed at the panels' mirror angle to catch glints */}
      <directionalLight position={[0, 6, -10]} intensity={1.6} color="#f6c35c" />
      <directionalLight position={[-4, 7, 9]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[4, 10, -1]} intensity={0.8} color="#ffe2a8" />
      <Sun />
      <PanelField layout={layout} />
      <Particles count={particles} layout={layout} />
      <Rig />
    </Canvas>
  );
}
