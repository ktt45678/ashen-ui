/** Lightweight "safe triangle" menu aim. */
export interface SnPoint { x: number; y: number; }

function sign(p1: SnPoint, p2: SnPoint, p3: SnPoint): number {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(p: SnPoint, a: SnPoint, b: SnPoint, c: SnPoint): boolean {
  const d1 = sign(p, a, b); const d2 = sign(p, b, c); const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

export function snIsAimingAtSubmenu(prev: SnPoint, curr: SnPoint, submenuRect: DOMRect): boolean {
  const submenuIsRight = submenuRect.left >= prev.x;
  const edgeX = submenuIsRight ? submenuRect.left : submenuRect.right;
  const towardSubmenu = submenuIsRight ? curr.x >= prev.x - 2 : curr.x <= prev.x + 2;
  if (!towardSubmenu) return false;
  const top: SnPoint = { x: edgeX, y: submenuRect.top - 8 };
  const bottom: SnPoint = { x: edgeX, y: submenuRect.bottom + 8 };
  return pointInTriangle(curr, prev, top, bottom);
}
