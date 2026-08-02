import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dagre from "@dagrejs/dagre";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CfgGraph as Graph, CfgKind } from "@/lib/tripla/cfg";

interface Placed {
  id: number;
  kind: CfgKind;
  label: string;
  x: number; // center
  y: number;
  w: number;
  h: number;
}
interface PlacedEdge {
  from: number;
  to: number;
  label?: "T" | "F";
  back?: boolean;
  points: { x: number; y: number }[];
}
interface Layout {
  nodes: Placed[];
  edges: PlacedEdge[];
  width: number;
  height: number;
}

const CHAR_W = 7.3;
const MAX_CHARS = 30;

const truncate = (s: string) => (s.length > MAX_CHARS ? s.slice(0, MAX_CHARS - 1) + "…" : s);

function nodeSize(kind: CfgKind, label: string) {
  const text = truncate(label);
  const w = Math.min(260, Math.max(58, Math.round(text.length * CHAR_W) + 28));
  if (kind === "diamond") return { w: Math.max(w, 96), h: 54 };
  return { w, h: 38 };
}

function computeLayout(graph: Graph): Layout {
  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: "TB", nodesep: 26, ranksep: 46, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of graph.nodes) {
    const { w, h } = nodeSize(n.kind, n.label);
    g.setNode(String(n.id), { width: w, height: h });
  }
  graph.edges.forEach((e, i) => {
    g.setEdge(String(e.from), String(e.to), {}, `e${i}`);
  });

  dagre.layout(g);

  const nodes: Placed[] = graph.nodes.map((n) => {
    const gn = g.node(String(n.id));
    return { ...n, x: gn.x, y: gn.y, w: gn.width, h: gn.height };
  });
  const edges: PlacedEdge[] = graph.edges.map((e, i) => {
    const ge = g.edge(String(e.from), String(e.to), `e${i}`);
    return { ...e, points: ge?.points ?? [] };
  });
  const { width = 0, height = 0 } = g.graph();
  return { nodes, edges, width, height };
}

/* ----------------------------------------------------------- node styles */

// Theme-aware colors via CSS variables (adapt to light/dark automatically).
const KIND_STYLE: Record<CfgKind, { fill: string; stroke: string; text: string }> = {
  start: { fill: "hsl(var(--primary) / 0.15)", stroke: "hsl(var(--primary))", text: "hsl(var(--primary))" },
  end: { fill: "hsl(var(--primary) / 0.15)", stroke: "hsl(var(--primary))", text: "hsl(var(--primary))" },
  call: { fill: "hsl(12 80% 55% / 0.15)", stroke: "hsl(12 80% 55%)", text: "hsl(12 80% 45%)" },
  return: { fill: "hsl(12 80% 55% / 0.15)", stroke: "hsl(12 80% 55%)", text: "hsl(12 80% 45%)" },
  diamond: { fill: "hsl(var(--syntax-keyword) / 0.14)", stroke: "hsl(var(--syntax-keyword))", text: "hsl(var(--foreground))" },
  stmt: { fill: "hsl(var(--card))", stroke: "hsl(var(--border))", text: "hsl(var(--foreground))" },
};

const NodeShape = ({ n }: { n: Placed }) => {
  const s = KIND_STYLE[n.kind];
  const label = truncate(n.label);
  const common = { fill: s.fill, stroke: s.stroke, strokeWidth: 1.5 };
  return (
    <g>
      <title>{n.label}</title>
      {n.kind === "diamond" ? (
        <polygon
          points={`${n.x},${n.y - n.h / 2} ${n.x + n.w / 2},${n.y} ${n.x},${n.y + n.h / 2} ${n.x - n.w / 2},${n.y}`}
          {...common}
        />
      ) : n.kind === "start" || n.kind === "end" ? (
        <ellipse cx={n.x} cy={n.y} rx={n.w / 2} ry={n.h / 2} {...common} />
      ) : (
        <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={8} {...common} />
      )}
      <text
        x={n.x}
        y={n.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'JetBrains Mono', monospace"
        fontSize={12}
        fontWeight={n.kind === "start" || n.kind === "end" || n.kind === "call" || n.kind === "return" ? 600 : 400}
        fill={s.text}
      >
        {label}
      </text>
    </g>
  );
};

const pointsToPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

const EdgePath = ({ e }: { e: PlacedEdge }) => {
  if (e.points.length < 2) return null;
  const color = e.back ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground) / 0.55)";
  const mid = e.points[Math.floor(e.points.length / 2)];
  return (
    <g>
      <path
        d={pointsToPath(e.points)}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={e.back ? "5 4" : undefined}
        markerEnd={e.back ? "url(#cfg-arrow-back)" : "url(#cfg-arrow)"}
      />
      {e.label && (
        <g>
          <rect x={mid.x - 8} y={mid.y - 9} width={16} height={16} rx={4} fill="hsl(var(--background))" />
          <text
            x={mid.x}
            y={mid.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={700}
            fill={e.label === "T" ? "hsl(var(--stack-push))" : "hsl(var(--destructive))"}
          >
            {e.label}
          </text>
        </g>
      )}
    </g>
  );
};

/* ------------------------------------------------------------ component */

const MIN_K = 0.15;
const MAX_K = 2.5;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const CfgGraph = ({ graph }: { graph: Graph }) => {
  const layout = useMemo(() => computeLayout(graph), [graph]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const fit = useCallback(() => {
    const el = containerRef.current;
    if (!el || layout.width === 0) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const k = clamp(Math.min(cw / layout.width, ch / layout.height) * 0.92, MIN_K, MAX_K);
    setT({ x: (cw - layout.width * k) / 2, y: (ch - layout.height * k) / 2, k });
  }, [layout]);

  useLayoutEffect(() => {
    fit();
  }, [fit]);

  // Native, non-passive wheel handler for zoom-to-cursor.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = ev.clientX - rect.left;
      const py = ev.clientY - rect.top;
      setT((prev) => {
        const factor = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
        const k = clamp(prev.k * factor, MIN_K, MAX_K);
        const ratio = k / prev.k;
        return { k, x: px - (px - prev.x) * ratio, y: py - (py - prev.y) * ratio };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setT((prev) => ({ ...prev, x: drag.current!.tx + (e.clientX - drag.current!.x), y: drag.current!.ty + (e.clientY - drag.current!.y) }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const zoomBy = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setT((prev) => {
      const k = clamp(prev.k * factor, MIN_K, MAX_K);
      const ratio = k / prev.k;
      return { k, x: cx - (cx - prev.x) * ratio, y: cy - (cy - prev.y) * ratio };
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted/20">
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg width="100%" height="100%">
          <defs>
            <marker id="cfg-arrow" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L8,3 L0,6 Z" fill="hsl(var(--foreground) / 0.55)" />
            </marker>
            <marker id="cfg-arrow-back" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L8,3 L0,6 Z" fill="hsl(var(--muted-foreground))" />
            </marker>
          </defs>
          <g transform={`translate(${t.x},${t.y}) scale(${t.k})`}>
            {layout.edges.map((e, i) => (
              <EdgePath key={i} e={e} />
            ))}
            {layout.nodes.map((n) => (
              <NodeShape key={n.id} n={n} />
            ))}
          </g>
        </svg>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <ControlButton onClick={() => zoomBy(1.2)} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={() => zoomBy(1 / 1.2)} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={fit} title="Fit to view">
          <Maximize2 className="h-4 w-4" />
        </ControlButton>
      </div>

      {/* Legend */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-x-3 gap-y-1 rounded-lg border border-border bg-background/85 px-3 py-2 text-[11px] backdrop-blur">
        <LegendItem swatch="hsl(var(--primary))" label="Start / End" />
        <LegendItem swatch="hsl(12 80% 55%)" label="Call / Return" />
        <LegendItem swatch="hsl(var(--syntax-keyword))" label="Decision" shape="diamond" />
        <LegendItem swatch="hsl(var(--border))" label="Statement" />
      </div>
      <div className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
        drag to pan · scroll to zoom · {Math.round(t.k * 100)}%
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted"
  >
    {children}
  </button>
);

const LegendItem = ({ swatch, label, shape }: { swatch: string; label: string; shape?: "diamond" }) => (
  <span className="flex items-center gap-1.5">
    <span
      className={cn("inline-block h-3 w-3 border", shape === "diamond" ? "rotate-45" : "rounded-sm")}
      style={{ borderColor: swatch, backgroundColor: `color-mix(in srgb, ${swatch} 18%, transparent)` }}
    />
    <span className="text-muted-foreground">{label}</span>
  </span>
);
