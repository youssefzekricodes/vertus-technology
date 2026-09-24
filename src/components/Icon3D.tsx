/**
 * Isometric 3D icon set. Every icon is built from the same primitives
 * (box, cylinder, sphere, extrusion) and four materials, lit from the top-left,
 * so the set reads as one family. Pure SVG: crisp at any size, no WebGL context.
 */

export type Icon3DName =
  | "panel" | "study" | "industry" | "home" | "monitor" | "bolt"
  | "sun" | "inverter" | "smart" | "battery"
  | "gear" | "shield" | "bulb" | "bubble";

type V3 = [number, number, number];
type Mat = { top: string; left: string; right: string };

const MAT = {
  gold: { top: "#ffd27a", left: "#f0a81b", right: "#c27c0e" },
  slate: { top: "#4a5f7a", left: "#2c3c52", right: "#1c2838" },
  steel: { top: "#f7f8f5", left: "#d3d7cf", right: "#aab0a6" },
  leaf: { top: "#7ddba4", left: "#34a86b", right: "#237a4c" },
} satisfies Record<string, Mat>;
type MatName = keyof typeof MAT;

// Isometric projection into a 64×64 viewBox; origin sits on the ground plane.
const S = 12;
const CX = 32;
const CY = 40;
const COS30 = 0.866;
// A radius-1 circle on the ground projects to an ellipse of these half-axes.
const ELL_RX = 1.2247;
const ELL_RY = 0.7071;

function p([x, y, z]: V3): [number, number] {
  return [CX + (x - y) * S * COS30, CY + (x + y) * S * 0.5 - z * S];
}
function pts(vs: V3[]): string {
  return vs.map((v) => p(v).map((n) => n.toFixed(2)).join(",")).join(" ");
}

function Face({ v, fill, opacity }: { v: V3[]; fill: string; opacity?: number }) {
  // Same-colour stroke seals hairline seams between adjacent faces.
  return (
    <polygon
      points={pts(v)}
      fill={fill}
      stroke={fill}
      strokeWidth={0.4}
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

function Line({ v, stroke, width = 1.2, opacity }: { v: V3[]; stroke: string; width?: number; opacity?: number }) {
  return (
    <polyline
      points={pts(v)}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

function Box({ at: [x, y, z], size: [w, d, h], m }: { at: V3; size: V3; m: MatName }) {
  const c = MAT[m];
  return (
    <g>
      <Face fill={c.top} v={[[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]} />
      <Face fill={c.left} v={[[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]} />
      <Face fill={c.right} v={[[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]} />
    </g>
  );
}

function Cylinder({ at, r, h, m }: { at: V3; r: number; h: number; m: MatName }) {
  const [bx, by] = p(at);
  const [tx, ty] = p([at[0], at[1], at[2] + h]);
  const rx = r * S * ELL_RX;
  const ry = r * S * ELL_RY;
  return (
    <g>
      <path
        d={`M${tx - rx},${ty} L${bx - rx},${by} A${rx},${ry} 0 0 0 ${bx + rx},${by} L${tx + rx},${ty} Z`}
        fill={`url(#i3d-cyl-${m})`}
      />
      <ellipse cx={tx} cy={ty} rx={rx} ry={ry} fill={MAT[m].top} />
    </g>
  );
}

function Sphere({ at, r, gradient }: { at: V3; r: number; gradient: string }) {
  const [cx, cy] = p(at);
  return <circle cx={cx} cy={cy} r={r * S * ELL_RX} fill={`url(#${gradient})`} />;
}

/**
 * Extrudes a 2D outline (u → x, v → z) toward the viewer along +y.
 * Only sides facing up or right are visible; the front face covers the rest.
 */
function Extrude({
  outline,
  at: [x0, z0],
  front,
  depth,
  m,
}: {
  outline: [number, number][];
  at: [number, number];
  front: number;
  depth: number;
  m: MatName;
}) {
  const c = MAT[m];
  const back = front - depth;
  const n = outline.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [u1, v1] = outline[i];
    const [u2, v2] = outline[(i + 1) % n];
    area += u1 * v2 - u2 * v1;
  }
  const ccw = area > 0;

  const sides = outline
    .map(([u1, v1], i) => {
      const [u2, v2] = outline[(i + 1) % n];
      const nx = ccw ? v2 - v1 : v1 - v2;
      const nz = ccw ? u1 - u2 : u2 - u1;
      return { u1, v1, u2, v2, nx, nz, depth: (u1 + u2) / 2 + (v1 + v2) / 2 };
    })
    .filter((s) => s.nx > 1e-6 || s.nz > 1e-6)
    .sort((a, b) => a.depth - b.depth);

  return (
    <g>
      {sides.map((s, i) => (
        <Face
          key={i}
          fill={s.nz > Math.abs(s.nx) ? c.top : c.right}
          v={[
            [x0 + s.u1, back, z0 + s.v1],
            [x0 + s.u2, back, z0 + s.v2],
            [x0 + s.u2, front, z0 + s.v2],
            [x0 + s.u1, front, z0 + s.v1],
          ]}
        />
      ))}
      <Face fill={c.left} v={outline.map(([u, v]) => [x0 + u, front, z0 + v] as V3)} />
    </g>
  );
}

function circleOnFront(cx: number, cz: number, y: number, r: number, steps = 20): V3[] {
  return Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    return [cx + r * Math.cos(t), y, cz + r * Math.sin(t)] as V3;
  });
}

function roundedBubble(w: number, h: number, r: number): [number, number][] {
  const out: [number, number][] = [];
  const arc = (cu: number, cv: number, a0: number, a1: number) => {
    for (let i = 0; i <= 4; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 4) * Math.PI) / 180;
      out.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]);
    }
  };
  const hw = w / 2;
  arc(hw - r, r, -90, 0);
  arc(hw - r, h - r, 0, 90);
  arc(-hw + r, h - r, 90, 180);
  arc(-hw + r, r, 180, 270);
  out.push([-hw + 0.2, -0.3], [-hw + 0.6, 0]);
  return out;
}

function gearOutline(teeth: number, ro: number, ri: number, cz: number): [number, number][] {
  const out: [number, number][] = [];
  const step = (Math.PI * 2) / (teeth * 4);
  const radii = [ri, ro, ro, ri];
  for (let i = 0; i < teeth * 4; i++) {
    const a = i * step;
    out.push([radii[i % 4] * Math.cos(a), cz + radii[i % 4] * Math.sin(a)]);
  }
  return out;
}

const panelZ = (y: number) => 0.45 + (0.9 - y) * 0.42;

const ICONS: Record<Icon3DName, React.ReactNode> = {
  panel: (
    <>
      <Box at={[-0.85, -0.75, 0]} size={[0.1, 0.1, 1.1]} m="steel" />
      <Box at={[0.75, -0.75, 0]} size={[0.1, 0.1, 1.1]} m="steel" />
      <Box at={[-0.85, 0.6, 0]} size={[0.1, 0.1, 0.5]} m="steel" />
      <Box at={[0.75, 0.6, 0]} size={[0.1, 0.1, 0.5]} m="steel" />
      <Face fill={MAT.steel.right} v={[[1.1, -0.9, panelZ(-0.9)], [1.1, 0.9, panelZ(0.9)], [1.1, 0.9, panelZ(0.9) - 0.1], [1.1, -0.9, panelZ(-0.9) - 0.1]]} />
      <Face fill={MAT.steel.left} v={[[-1.1, 0.9, panelZ(0.9)], [1.1, 0.9, panelZ(0.9)], [1.1, 0.9, panelZ(0.9) - 0.1], [-1.1, 0.9, panelZ(0.9) - 0.1]]} />
      <Face fill={MAT.slate.left} v={[[-1.1, -0.9, panelZ(-0.9)], [1.1, -0.9, panelZ(-0.9)], [1.1, 0.9, panelZ(0.9)], [-1.1, 0.9, panelZ(0.9)]]} />
      {[-0.55, 0, 0.55].map((x) => (
        <Line key={x} stroke="#7394bd" width={0.6} opacity={0.85} v={[[x, -0.9, panelZ(-0.9)], [x, 0.9, panelZ(0.9)]]} />
      ))}
      {[-0.3, 0.3].map((y) => (
        <Line key={y} stroke="#7394bd" width={0.6} opacity={0.85} v={[[-1.1, y, panelZ(y)], [1.1, y, panelZ(y)]]} />
      ))}
      <Face fill="#ffffff" opacity={0.14} v={[[-0.35, -0.9, panelZ(-0.9)], [0.15, -0.9, panelZ(-0.9)], [-0.45, 0.9, panelZ(0.9)], [-0.95, 0.9, panelZ(0.9)]]} />
      <polygon
        points={pts([[-1.1, -0.9, panelZ(-0.9)], [1.1, -0.9, panelZ(-0.9)], [1.1, 0.9, panelZ(0.9)], [-1.1, 0.9, panelZ(0.9)]])}
        fill="none"
        stroke={MAT.gold.left}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </>
  ),

  study: (
    <>
      <Box at={[-1.1, -1.1, 0]} size={[2.2, 2.2, 0.14]} m="steel" />
      <Box at={[-0.85, -0.3, 0.14]} size={[0.5, 0.5, 0.55]} m="slate" />
      <Box at={[-0.2, -0.3, 0.14]} size={[0.5, 0.5, 0.95]} m="slate" />
      <Box at={[0.45, -0.3, 0.14]} size={[0.5, 0.5, 1.45]} m="gold" />
    </>
  ),

  industry: (
    <>
      <Cylinder at={[0.7, -0.8, 0]} r={0.18} h={1.75} m="steel" />
      <Cylinder at={[0.7, -0.8, 1.42]} r={0.185} h={0.18} m="gold" />
      <Box at={[-1, -0.6, 0]} size={[2, 1.4, 0.65]} m="steel" />
      {[0, 1, 2].map((i) => {
        const x = -1 + i * 0.667;
        const w = 0.667;
        return (
          <g key={i}>
            <Face fill="#e4e7e0" v={[[x, -0.6, 0.65], [x + w, -0.6, 1.05], [x + w, 0.8, 1.05], [x, 0.8, 0.65]]} />
            <Face fill={MAT.slate.left} v={[[x + w, -0.6, 0.65], [x + w, 0.8, 0.65], [x + w, 0.8, 1.05], [x + w, -0.6, 1.05]]} />
            <Face fill={MAT.steel.left} v={[[x, 0.8, 0.65], [x + w, 0.8, 0.65], [x + w, 0.8, 1.05]]} />
          </g>
        );
      })}
      {[0, 1, 2, 3].map((k) => {
        const x = -0.85 + k * 0.47;
        return <Face key={k} fill={MAT.gold.left} v={[[x, 0.801, 0.22], [x + 0.28, 0.801, 0.22], [x + 0.28, 0.801, 0.45], [x, 0.801, 0.45]]} />;
      })}
    </>
  ),

  home: (
    <>
      <Box at={[-0.8, -0.7, 0]} size={[1.6, 1.4, 0.8]} m="steel" />
      <Face fill={MAT.steel.right} v={[[0.8, -0.7, 0.8], [0.8, 0.7, 0.8], [0.8, 0, 1.4]]} />
      <Face fill={MAT.gold.top} v={[[-0.95, -0.85, 0.72], [0.95, -0.85, 0.72], [0.95, 0, 1.4], [-0.95, 0, 1.4]]} />
      <Face fill={MAT.gold.right} v={[[0.95, 0, 1.4], [0.95, 0.85, 0.72], [0.95, 0.85, 0.64], [0.95, 0, 1.32]]} />
      <Face fill={MAT.gold.left} v={[[-0.95, 0, 1.4], [0.95, 0, 1.4], [0.95, 0.85, 0.72], [-0.95, 0.85, 0.72]]} />
      <Face fill={MAT.gold.right} v={[[-0.95, 0.85, 0.72], [0.95, 0.85, 0.72], [0.95, 0.85, 0.64], [-0.95, 0.85, 0.64]]} />
      <Face fill={MAT.slate.left} v={[[-0.7, 0.15, 1.29], [0.5, 0.15, 1.29], [0.5, 0.68, 0.87], [-0.7, 0.68, 0.87]]} />
      <Line stroke="#7394bd" width={0.6} v={[[-0.1, 0.15, 1.29], [-0.1, 0.68, 0.87]]} />
      <Line stroke="#7394bd" width={0.6} v={[[-0.7, 0.415, 1.08], [0.5, 0.415, 1.08]]} />
      <Face fill={MAT.slate.left} v={[[0.2, 0.701, 0], [0.5, 0.701, 0], [0.5, 0.701, 0.5], [0.2, 0.701, 0.5]]} />
      <Face fill={MAT.gold.top} v={[[-0.55, 0.701, 0.3], [-0.2, 0.701, 0.3], [-0.2, 0.701, 0.55], [-0.55, 0.701, 0.55]]} />
    </>
  ),

  monitor: (
    <>
      <Box at={[-0.45, -0.3, 0]} size={[0.9, 0.6, 0.08]} m="steel" />
      <Box at={[-0.07, -0.07, 0.08]} size={[0.14, 0.14, 0.55]} m="steel" />
      <Box at={[-1.15, -0.12, 0.55]} size={[2.3, 0.2, 1.25]} m="slate" />
      <Face fill="#141d28" v={[[-1.02, 0.081, 0.66], [1.02, 0.081, 0.66], [1.02, 0.081, 1.7], [-1.02, 0.081, 1.7]]} />
      <Line stroke={MAT.gold.left} width={1.6} v={[[-0.85, 0.082, 0.85], [-0.42, 0.082, 1.1], [0, 0.082, 0.95], [0.4, 0.082, 1.35], [0.82, 0.082, 1.52]]} />
      <circle cx={p([0.82, 0.082, 1.52])[0]} cy={p([0.82, 0.082, 1.52])[1]} r={1.8} fill={MAT.gold.top} />
    </>
  ),

  bolt: (
    <Extrude
      outline={[[0.3, 1.85], [-0.6, 0.8], [-0.05, 0.8], [-0.35, 0.02], [0.6, 1.1], [0.05, 1.1]]}
      at={[0, 0]}
      front={0.18}
      depth={0.36}
      m="gold"
    />
  ),

  sun: (() => {
    const rays = Array.from({ length: 8 }, (_, k) => {
      const t = (k * Math.PI) / 4;
      const x = 1.2 * Math.cos(t);
      const z = 1.05 + 1.2 * Math.sin(t);
      return { x, z, depth: x + z };
    });
    const ray = (r: (typeof rays)[number], i: number) => (
      <Box key={i} at={[r.x - 0.09, -0.09, r.z - 0.09]} size={[0.18, 0.18, 0.18]} m="gold" />
    );
    return (
      <>
        {rays.filter((r) => r.depth < 1.05).map(ray)}
        <Sphere at={[0, 0, 1.05]} r={0.62} gradient="i3d-sun" />
        {rays.filter((r) => r.depth >= 1.05).map(ray)}
      </>
    );
  })(),

  inverter: (
    <>
      <Box at={[-0.75, -0.45, 0]} size={[1.5, 0.9, 1.65]} m="steel" />
      <Face fill={MAT.slate.left} v={[[-0.5, 0.451, 1.05], [0.5, 0.451, 1.05], [0.5, 0.451, 1.45], [-0.5, 0.451, 1.45]]} />
      <Line
        stroke={MAT.gold.top}
        width={1.1}
        v={Array.from({ length: 13 }, (_, i) => {
          const x = -0.38 + (i / 12) * 0.76;
          return [x, 0.452, 1.25 + 0.09 * Math.sin((i / 12) * Math.PI * 2)] as V3;
        })}
      />
      {[0.3, 0.45, 0.6].map((z) => (
        <Line key={z} stroke={MAT.steel.right} width={0.9} v={[[-0.5, 0.452, z], [0.3, 0.452, z]]} />
      ))}
      <circle cx={p([0.48, 0.452, 0.8])[0]} cy={p([0.48, 0.452, 0.8])[1]} r={1.4} fill={MAT.leaf.top} />
    </>
  ),

  smart: (
    <>
      <Box at={[-1.15, -1.15, 0]} size={[2.3, 2.3, 0.12]} m="slate" />
      {([[-0.75, -0.75], [0.75, -0.75], [-0.75, 0.75], [0.75, 0.75]] as const).map(([x, y]) => (
        <Line key={`${x}${y}`} stroke={MAT.gold.left} width={1.2} v={[[0, 0, 0.121], [x, y, 0.121]]} />
      ))}
      <Box at={[-0.9, -0.9, 0.12]} size={[0.3, 0.3, 0.3]} m="steel" />
      <Box at={[0.6, -0.9, 0.12]} size={[0.3, 0.3, 0.3]} m="steel" />
      <Box at={[-0.9, 0.6, 0.12]} size={[0.3, 0.3, 0.3]} m="steel" />
      <Box at={[-0.3, -0.3, 0.12]} size={[0.6, 0.6, 0.75]} m="gold" />
      <Box at={[0.6, 0.6, 0.12]} size={[0.3, 0.3, 0.3]} m="steel" />
    </>
  ),

  battery: (
    <>
      <Box at={[-0.6, -0.45, 0]} size={[1.2, 0.9, 1.5]} m="slate" />
      <Box at={[-0.4, -0.15, 1.5]} size={[0.22, 0.22, 0.14]} m="gold" />
      <Box at={[0.2, -0.15, 1.5]} size={[0.22, 0.22, 0.14]} m="steel" />
      {[
        [0.12, 0.4, MAT.leaf.left],
        [0.46, 0.74, MAT.leaf.left],
        [0.8, 1.08, MAT.leaf.left],
        [1.14, 1.38, MAT.slate.top],
      ].map(([z0, z1, fill]) => (
        <Face
          key={z0 as number}
          fill={fill as string}
          v={[[-0.42, 0.451, z0 as number], [0.42, 0.451, z0 as number], [0.42, 0.451, z1 as number], [-0.42, 0.451, z1 as number]]}
        />
      ))}
    </>
  ),

  gear: (
    <>
      <Extrude outline={gearOutline(8, 0.92, 0.7, 0.95)} at={[0, 0]} front={0.15} depth={0.3} m="steel" />
      <Face fill={MAT.gold.left} v={circleOnFront(0, 0.95, 0.151, 0.34)} />
      <Face fill={MAT.slate.left} v={circleOnFront(0, 0.95, 0.152, 0.15)} />
    </>
  ),

  shield: (
    <>
      <Extrude
        outline={[[-0.8, 1.8], [-0.8, 1.0], [-0.6, 0.55], [-0.3, 0.25], [0, 0.05], [0.3, 0.25], [0.6, 0.55], [0.8, 1.0], [0.8, 1.8]]}
        at={[0, 0]}
        front={0.15}
        depth={0.3}
        m="gold"
      />
      <Line stroke={MAT.steel.top} width={2.2} v={[[-0.38, 0.151, 1.05], [-0.1, 0.151, 0.75], [0.42, 0.151, 1.4]]} />
    </>
  ),

  bulb: (
    <>
      <Cylinder at={[0, 0, 0.05]} r={0.34} h={0.5} m="steel" />
      <Cylinder at={[0, 0, 0.15]} r={0.345} h={0.05} m="slate" />
      <Cylinder at={[0, 0, 0.3]} r={0.345} h={0.05} m="slate" />
      <Sphere at={[0, 0, 1.25]} r={0.82} gradient="i3d-glow" />
      <Sphere at={[0, 0, 1.25]} r={0.66} gradient="i3d-bulb" />
      <Line
        stroke={MAT.gold.right}
        width={1}
        v={[[-0.18, 0, 0.62], [-0.18, 0, 1.05], [0, 0, 1.25], [0.18, 0, 1.05], [0.18, 0, 0.62]]}
      />
    </>
  ),

  bubble: (
    <>
      <Extrude outline={roundedBubble(1.5, 0.95, 0.22)} at={[0.35, 0.95]} front={-0.25} depth={0.25} m="steel" />
      <Extrude outline={roundedBubble(1.6, 1.0, 0.22)} at={[-0.25, 0.35]} front={0.3} depth={0.25} m="gold" />
      {[-0.7, -0.25, 0.2].map((x) => {
        const [cx, cy] = p([x, 0.301, 0.85]);
        return <circle key={x} cx={cx} cy={cy} r={1.7} fill={MAT.slate.left} />;
      })}
    </>
  ),
};

// Upright/extruded icons have a smaller footprint than the ground-plane ones;
// these factors equalise visual weight across the set.
const SCALE: Partial<Record<Icon3DName, number>> = {
  bolt: 1.5,
  gear: 1.3,
  shield: 1.3,
  bulb: 1.2,
  bubble: 1.2,
  battery: 1.15,
  inverter: 1.1,
  sun: 1.1,
};

function Defs() {
  return (
    <defs>
      <radialGradient id="i3d-shadow">
        <stop offset="0" stopColor="#000" stopOpacity="0.28" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="i3d-sun" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#fff4d0" />
        <stop offset="0.35" stopColor="#ffc94d" />
        <stop offset="0.7" stopColor="#f0a81b" />
        <stop offset="1" stopColor="#b8700a" />
      </radialGradient>
      <radialGradient id="i3d-bulb" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.4" stopColor="#fff3cf" />
        <stop offset="0.85" stopColor="#f6d27a" />
        <stop offset="1" stopColor="#d9a441" />
      </radialGradient>
      <radialGradient id="i3d-glow">
        <stop offset="0.6" stopColor="#ffc94d" stopOpacity="0.45" />
        <stop offset="1" stopColor="#ffc94d" stopOpacity="0" />
      </radialGradient>
      {(Object.keys(MAT) as MatName[]).map((k) => (
        <linearGradient key={k} id={`i3d-cyl-${k}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={MAT[k].left} />
          <stop offset="0.3" stopColor={MAT[k].top} />
          <stop offset="0.6" stopColor={MAT[k].left} />
          <stop offset="1" stopColor={MAT[k].right} />
        </linearGradient>
      ))}
    </defs>
  );
}

export function Icon3D({
  name,
  size = 64,
  className,
}: {
  name: Icon3DName;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={className}>
      <Defs />
      <ellipse cx={CX} cy={CY + 3} rx={21} ry={7.5} fill="url(#i3d-shadow)" />
      <g transform={`translate(${CX} 30) scale(${SCALE[name] ?? 1}) translate(${-CX} -30)`}>{ICONS[name]}</g>
    </svg>
  );
}
