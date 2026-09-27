"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/**
 * Daylight solar scene: bright sun in a clear sky (the sky gradient and clouds
 * are CSS behind this transparent canvas), green fields, hazy hills, an
 * instanced photovoltaic field and sunlight particles landing on the panels.
 * `quality` trims particle and instance counts on small/low-end devices.
 */

const HORIZON = "#d7ecf8";
/** Centre of the solar farm: the camera orbits around it. */
const FARM = { x: 0, y: -2, z: -0.5 };

function sunPosition(aspect: number) {
  // Upper-right on landscape screens, nearer the middle on portrait phones.
  return new THREE.Vector3(aspect < 1 ? 5 : 21, aspect < 1 ? 14.6 : 12.6, -26);
}

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
    float a = smoothstep(0.5, 0.05, d) * vFade * 0.85;
    gl_FragColor = vec4(1.0, 0.84, 0.36, a);
  }
`;

/** Soft radial sprite used for the sun's halo. */
function makeGlowTexture(inner: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.18, inner);
  grad.addColorStop(0.45, outer);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft sunburst: tapered rays fading outward, drawn once to a canvas. */
function makeRaysTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.translate(256, 256);
  const rays = 18;
  for (let i = 0; i < rays; i++) {
    const long = i % 2 === 0;
    const len = long ? 250 : 170;
    const half = (Math.PI / rays) * (long ? 0.32 : 0.22);
    const grad = g.createRadialGradient(0, 0, 40, 0, 0, len);
    grad.addColorStop(0, "rgba(255,226,120,0.55)");
    grad.addColorStop(1, "rgba(255,226,120,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(0, 0);
    g.arc(0, 0, len, (i / rays) * Math.PI * 2 - half, (i / rays) * Math.PI * 2 + half);
    g.closePath();
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CAMERA_REST = new THREE.Vector3(0, 1.1, 8.5);

/** Keeps `live` = sun base position + camera offset, so the sun behaves as if infinitely far away. */
function useSunFollow(base: THREE.Vector3, live: THREE.Vector3) {
  const { camera } = useThree();
  useFrame(() => {
    live.copy(base).add(camera.position).sub(CAMERA_REST);
  });
}

function Sun({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  const root = useRef<THREE.Group>(null);
  const halo = useMemo(() => makeGlowTexture("rgba(255,222,100,0.95)", "rgba(255,205,70,0.28)"), []);
  const sheen = useMemo(() => makeGlowTexture("rgba(255,255,235,0.9)", "rgba(255,245,200,0.15)"), []);
  const raysTex = useMemo(() => makeRaysTexture(), []);
  useEffect(
    () => () => {
      halo.dispose();
      sheen.dispose();
      raysTex.dispose();
    },
    [halo, sheen, raysTex]
  );
  const glow = useRef<THREE.Sprite>(null);
  const rays = useRef<THREE.Mesh>(null);
  const rays2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (root.current) root.current.position.copy(position);
    if (glow.current) {
      const k = 1 + Math.sin(t * 1.1) * 0.05 + Math.sin(t * 2.7) * 0.02; // shimmer
      glow.current.scale.set(22 * k, 22 * k, 1);
    }
    if (rays.current) rays.current.rotation.z += dt * 0.05;
    if (rays2.current) {
      rays2.current.rotation.z -= dt * 0.03;
      (rays2.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 0.9) * 0.2;
    }
  });
  return (
    <group ref={root} position={position} scale={scale}>
      {/* two counter-rotating sunbursts + a shimmering golden halo */}
      <mesh ref={rays} position={[0, 0, -0.9]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial map={raysTex} transparent depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
      <mesh ref={rays2} position={[0, 0, -0.8]} rotation={[0, 0, 0.17]}>
        <planeGeometry args={[19, 19]} />
        <meshBasicMaterial map={raysTex} transparent opacity={0.6} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
      <sprite ref={glow} scale={[22, 22, 1]} position={[0, 0, -0.6]}>
        <spriteMaterial map={halo} transparent depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
      <mesh>
        <circleGeometry args={[3.7, 64]} />
        <meshBasicMaterial color="#ffd23f" toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial color="#ffe277" toneMapped={false} fog={false} />
      </mesh>
      {/* specular hot spot for a glossy, shiny disc */}
      <sprite scale={[5.2, 5.2, 1]} position={[-0.9, 0.9, 0.05]}>
        <spriteMaterial map={sheen} transparent depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
    </group>
  );
}

/**
 * Lens flare: soft discs on the line from the sun through the screen centre.
 * They slide as the camera follows the cursor, which makes the sun feel bright.
 */
const FLARES: [number, number, string][] = [
  [0.35, 0.9, "rgba(255,236,170,0.28)"],
  [0.7, 0.45, "rgba(255,250,225,0.22)"],
  [1.05, 1.2, "rgba(255,240,200,0.12)"],
];

function LensFlare({ sun }: { sun: THREE.Vector3 }) {
  const { camera } = useThree();
  const textures = useMemo(() => FLARES.map(([, , c]) => makeGlowTexture(c, c.replace(/[\d.]+\)$/, "0.08)"))), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const tmp = useMemo(() => ({ ndc: new THREE.Vector3(), p: new THREE.Vector3(), dir: new THREE.Vector3() }), []);
  useFrame(() => {
    tmp.ndc.copy(sun).project(camera);
    const visible = tmp.ndc.z < 1 && Math.abs(tmp.ndc.x) < 1.3 && Math.abs(tmp.ndc.y) < 1.3;
    FLARES.forEach(([k, size], i) => {
      const s = refs.current[i];
      if (!s) return;
      s.visible = visible;
      if (!visible) return;
      // point on the sun→centre line, placed 10 units in front of the camera
      tmp.p.set(tmp.ndc.x * (1 - k), tmp.ndc.y * (1 - k), 0.5).unproject(camera);
      tmp.dir.copy(tmp.p).sub(camera.position).normalize();
      s.position.copy(camera.position).addScaledVector(tmp.dir, 10);
      s.scale.set(size, size, 1);
    });
  });
  return (
    <group>
      {FLARES.map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <spriteMaterial
            map={textures[i]}
            transparent
            depthWrite={false}
            depthTest={false}
            fog={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ---------------- Land: low-poly rolling terrain + distant ridge ---------------- */

/** Deterministic 2D value noise (no Math.random → stable across renders). */
function hash2(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
function noise2(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm2(x: number, y: number) {
  let v = 0;
  let amp = 0.5;
  for (let i = 0; i < 4; i++) {
    v += amp * noise2(x, y);
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return v;
}

const GRASS_LOW = new THREE.Color("#4f8a3c");
const GRASS_MID = new THREE.Color("#78ad4f");
const GRASS_HIGH = new THREE.Color("#b3cf6e");

function Terrain() {
  const geometry = useMemo(() => {
    // faceted look: non-indexed geometry + flat shading
    // 360°: a square of land centred on the solar farm
    const g = new THREE.PlaneGeometry(320, 320, 84, 84).toNonIndexed();
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const col = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i) + FARM.z;
      // keep the solar farm area flat, let hills grow with distance
      const dist = Math.hypot(x / 1.4, z - FARM.z);
      const grow = THREE.MathUtils.smoothstep(dist, 9, 30);
      const n = fbm2(x * 0.045 + 3.1, z * 0.045 - 1.7);
      const h = (n - 0.35) * 9 * grow + grow * 0.6;
      pos.setY(i, Math.max(h, 0));
      const t = THREE.MathUtils.clamp(h / 6 + n * 0.35, 0, 1);
      col.copy(GRASS_LOW).lerp(GRASS_MID, Math.min(t * 1.6, 1));
      if (t > 0.6) col.lerp(GRASS_HIGH, (t - 0.6) / 0.4);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0, GROUND_Y, FARM.z]}>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} />
    </mesh>
  );
}

/** A ring of faceted blue-green mountains around the valley, softened by haze. */
const RIDGE = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + 0.2;
  const r = 100 + hash2(i, 3) * 22;
  const colors = ["#6f9aa4", "#7aa6ae", "#6c9793", "#80abb3"];
  return {
    x: Math.sin(a) * r,
    z: FARM.z - Math.cos(a) * r,
    radius: 20 + hash2(i, 7) * 16,
    height: 13 + hash2(i, 11) * 15,
    color: colors[i % colors.length],
  };
});

function Ridge() {
  return (
    <group>
      {RIDGE.map((m, i) => (
        <mesh key={i} position={[m.x, GROUND_Y + m.height / 2 - 1, m.z]} rotation={[0, i * 0.7, 0]}>
          <coneGeometry args={[m.radius, m.height, 7, 1]} />
          <meshStandardMaterial color={m.color} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Fluffy cloud sprite drawn from overlapping puffs. */
function makeCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  const puffs: [number, number, number][] = [
    [150, 160, 70],
    [230, 120, 90],
    [320, 130, 80],
    [390, 165, 60],
    [260, 175, 75],
  ];
  for (const [x, y, r] of puffs) {
    const grad = g.createRadialGradient(x, y - r * 0.2, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Clouds on a slow-turning ring around the whole scene (correct in 360°). */
const CLOUDS3D = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + hash2(i, 5) * 0.35;
  const r = 62 + hash2(i, 9) * 30;
  const w = 22 + hash2(i, 13) * 20;
  return { x: Math.sin(a) * r, y: 16 + hash2(i, 17) * 14, z: FARM.z - Math.cos(a) * r, w, o: 0.75 + hash2(i, 19) * 0.25 };
});

function Clouds() {
  const tex = useMemo(() => makeCloudTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += Math.min(dt, 0.05) * 0.006;
  });
  return (
    <group ref={group} position={[0, 0, FARM.z]}>
      {CLOUDS3D.map((c, i) => (
        <sprite key={i} position={[c.x, c.y, c.z - FARM.z]} scale={[c.w, c.w / 2, 1]}>
          <spriteMaterial map={tex} transparent opacity={c.o} depthWrite={false} fog={false} />
        </sprite>
      ))}
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

function Particles({ count, layout, sun }: { count: number; layout: Panel[]; sun: THREE.Vector3 }) {
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
      const s = sun.clone().addScaledVector(dir, 2);
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
  }, [count, layout, sun]);
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
  grad.addColorStop(0, "#3a74c2");
  grad.addColorStop(0.5, "#1f4f93");
  grad.addColorStop(1, "#14356b");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 320);
  // sky reflection sweeping across the glass
  const sheen = g.createLinearGradient(0, 0, 512, 320);
  sheen.addColorStop(0, "rgba(190,225,255,0.35)");
  sheen.addColorStop(0.35, "rgba(190,225,255,0.05)");
  sheen.addColorStop(0.6, "rgba(255,255,255,0)");
  sheen.addColorStop(0.8, "rgba(210,235,255,0.18)");
  g.fillStyle = sheen;
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
      {/* light gravel pad under the solar farm */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y + 0.02, -1]}>
        <planeGeometry args={[15.5, 8.5]} />
        <meshStandardMaterial color="#cfc6a8" roughness={1} />
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
          emissiveIntensity={0.12}
          metalness={0.35}
          roughness={0.25}
        />
      </Instanced>
    </group>
  );
}

const SWAY_PERIOD = 26; // seconds for one slow left–right–left glide

/**
 * Camera that animates on its own (works on phones, no cursor needed):
 * a slow sideways glide past the farm, a gentle bob and dolly, plus a light cursor
 * offset on desktop. Frame-rate independent (damped with the frame delta).
 */
function Rig() {
  const { camera, pointer, size } = useThree();
  const st = useRef({ time: 0, px: 0, py: 0, x: 0, prevX: 0, roll: 0, h: 3.1, look: 3.5, scroll: 0 });
  useFrame((_, dt) => {
    const s = st.current;
    const delta = Math.min(dt, 0.05); // no jumps after a tab switch
    s.time += delta;
    const t = s.time;
    s.scroll = Math.min(window.scrollY / window.innerHeight, 1);

    // cursor offset (desktop); stays 0 on touch devices
    s.px = THREE.MathUtils.damp(s.px, pointer.x, 2.5, delta);
    s.py = THREE.MathUtils.damp(s.py, pointer.y, 2.5, delta);

    // Lateral glide (a drone tracking shot): the camera slides sideways while
    // looking straight ahead, so nearby panels drift past but the distant sun
    // and mountains stay put — strong depth, and the sun never covers the text.
    // small, centred range: just enough movement to explore the scene
    const glide = size.width / size.height < 1 ? 0.45 : 0.8;
    s.prevX = s.x;
    s.x = Math.sin((t / SWAY_PERIOD) * Math.PI * 2) * glide + s.px * 0.5;
    const bob = Math.sin(t * 0.6) * 0.1;
    s.h = THREE.MathUtils.damp(s.h, 3.1 + s.py * 0.25 + bob - s.scroll * 1.4, 3, delta);
    s.look = THREE.MathUtils.damp(s.look, 3.5 + s.py * 0.2 - s.scroll, 3, delta);
    const radius = 9 + Math.sin(t * 0.21) * 0.25; // slight dolly in/out

    camera.position.set(FARM.x + s.x, FARM.y + s.h, FARM.z + radius);
    camera.lookAt(FARM.x + s.x, FARM.y + s.look, FARM.z - 5.5); // pure pan: the view stays centred

    // bank gently with the sideways motion
    const speed = (s.x - s.prevX) / Math.max(delta, 1e-3);
    s.roll = THREE.MathUtils.damp(s.roll, -speed * 0.008, 2, delta);
    camera.rotateZ(s.roll);
  });
  return null;
}

function Scene({ quality }: { quality: "high" | "low" }) {
  const { size } = useThree();
  const portrait = size.width / size.height < 1;
  const sun = useMemo(() => sunPosition(portrait ? 0.5 : 1.6), [portrait]);
  const sunLive = useMemo(() => sun.clone(), [sun]);
  useSunFollow(sun, sunLive);
  const particles = quality === "high" ? 520 : 180;
  const layout = useMemo(
    () => (quality === "high" ? panelLayout(3, 5) : panelLayout(2, 3)),
    [quality]
  );
  return (
    <>
      <fog attach="fog" args={[HORIZON, 26, 160]} />
      <hemisphereLight args={["#d6ecff", "#55703a", 1.0]} />
      <ambientLight intensity={0.35} />
      {/* the sun itself, plus a soft front fill so the glass faces read */}
      <directionalLight position={[sun.x, sun.y, sun.z]} intensity={2.1} color="#fff1cc" />
      <directionalLight position={[-4, 7, 9]} intensity={0.9} color="#ffffff" />
      <Sun position={sunLive} scale={portrait ? 0.45 : 1} />
      <LensFlare sun={sunLive} />
      <Clouds />
      <Ridge />
      <Terrain />
      <PanelField layout={layout} />
      <Particles count={particles} layout={layout} sun={sun} />
      <Rig />
    </>
  );
}

export default function Hero3D({ quality }: { quality: "high" | "low" }) {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 8.5], fov: 50 }}
      dpr={quality === "high" ? [1, 2] : 1}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      frameloop="always"
    >
      <Scene quality={quality} />
    </Canvas>
  );
}
