/** Build a self-contained CFG SVG (theme colors resolved) and trigger SVG/PNG downloads. */

const PAINT_ATTRS = ["fill", "stroke"] as const;
const PNG_TARGET_LONG_SIDE = 3000;
const PNG_MIN_SCALE = 2;
const PNG_MAX_SCALE = 4;

function resolveCssColor(value: string): string {
  if (!value || value === "none" || value === "currentColor" || value.startsWith("url(")) return value;
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;left:-9999px;visibility:hidden";
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || value;
}

function bakePaint(clone: Element, source: Element) {
  const cs = getComputedStyle(source);
  for (const attr of PAINT_ATTRS) {
    if (!source.hasAttribute(attr)) continue;
    const raw = source.getAttribute(attr)!;
    if (raw === "none" || raw.startsWith("url(")) continue;
    const computed = cs.getPropertyValue(attr).trim();
    if (computed && computed !== "none") clone.setAttribute(attr, computed);
  }

  const cloneKids = Array.from(clone.children);
  const sourceKids = Array.from(source.children);
  for (let i = 0; i < cloneKids.length; i++) {
    if (sourceKids[i]) bakePaint(cloneKids[i], sourceKids[i]);
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to rasterize CFG SVG"));
    img.src = url;
  });
}

export function buildExportSvg(
  sourceSvg: SVGSVGElement,
  size: { width: number; height: number },
): string {
  const clone = sourceSvg.cloneNode(true) as SVGSVGElement;
  bakePaint(clone, sourceSvg);

  const pad = 16;
  const w = Math.ceil(size.width + pad * 2);
  const h = Math.ceil(size.height + pad * 2);
  const bg = resolveCssColor("hsl(var(--background))");

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("viewBox", `${-pad} ${-pad} ${w} ${h}`);
  clone.removeAttribute("class");

  // Drop live pan/zoom; graph is already in layout coordinates.
  const content = clone.querySelector("g[transform]");
  content?.removeAttribute("transform");

  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", String(-pad));
  bgRect.setAttribute("y", String(-pad));
  bgRect.setAttribute("width", String(w));
  bgRect.setAttribute("height", String(h));
  bgRect.setAttribute("fill", bg);
  clone.insertBefore(bgRect, clone.firstChild);

  // Prefer system mono so standalone SVG/PNG don't depend on webfonts.
  clone.querySelectorAll("text").forEach((t) => {
    t.setAttribute("font-family", "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace");
  });

  const xml = new XMLSerializer().serializeToString(clone);
  return xml.startsWith("<?xml") ? xml : `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

export function downloadCfgSvg(sourceSvg: SVGSVGElement, size: { width: number; height: number }) {
  const svg = buildExportSvg(sourceSvg, size);
  triggerDownload(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "cfg.svg");
}

export async function downloadCfgPng(sourceSvg: SVGSVGElement, size: { width: number; height: number }) {
  const svg = buildExportSvg(sourceSvg, size);
  const pad = 16;
  const w = Math.ceil(size.width + pad * 2);
  const h = Math.ceil(size.height + pad * 2);
  const longSide = Math.max(w, h);
  const scale = Math.min(PNG_MAX_SCALE, Math.max(PNG_MIN_SCALE, PNG_TARGET_LONG_SIDE / longSide));

  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))), "image/png");
    });
    triggerDownload(blob, "cfg.png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
