import { describe, it, expect } from 'vitest';
import { snIsAimingAtSubmenu } from './menu-aim';

function rect(x: number, y: number, w: number, h: number): DOMRect {
  return {
    x, y, width: w, height: h,
    left: x, top: y, right: x + w, bottom: y + h,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('snIsAimingAtSubmenu', () => {
  // Right-side submenu: left=200, top=100, right=350, bottom=400
  const rightRect = rect(200, 100, 150, 300);

  it('returns true when moving right toward the submenu panel', () => {
    // From x=100,y=200 to x=180,y=220 → heading toward edge x=200
    expect(snIsAimingAtSubmenu({ x: 100, y: 200 }, { x: 180, y: 220 }, rightRect)).toBe(true);
  });

  it('returns false when moving leftward (away from right submenu)', () => {
    // curr.x < prev.x - 2 → towardSubmenu=false
    expect(snIsAimingAtSubmenu({ x: 180, y: 200 }, { x: 100, y: 200 }, rightRect)).toBe(false);
  });

  it('returns false when moving rightward but far above submenu top', () => {
    // curr heading right but well above the triangle
    expect(snIsAimingAtSubmenu({ x: 100, y: 200 }, { x: 190, y: 0 }, rightRect)).toBe(false);
  });

  it('returns false when moving rightward but far below submenu bottom', () => {
    expect(snIsAimingAtSubmenu({ x: 100, y: 200 }, { x: 190, y: 600 }, rightRect)).toBe(false);
  });

  it('returns true when moving right and curr is exactly at the edge midpoint', () => {
    // top-8=92, bottom+8=408; midpoint=(200,250); from (100,250) → (200,250) is on the edge
    expect(snIsAimingAtSubmenu({ x: 100, y: 250 }, { x: 200, y: 250 }, rightRect)).toBe(true);
  });

  // Left-side submenu: right=200, top=100, bottom=400 (rect x=50, w=150)
  const leftRect = rect(50, 100, 150, 300);

  it('returns true for left-side submenu when moving leftward toward it', () => {
    // submenuIsRight=false (right=200 < prev.x=250), edgeX=200
    // towardSubmenu: curr.x <= prev.x+2 → 220 <= 252 → true
    expect(snIsAimingAtSubmenu({ x: 250, y: 200 }, { x: 220, y: 210 }, leftRect)).toBe(true);
  });

  it('returns false for left-side submenu when moving rightward', () => {
    // curr.x=300 > prev.x+2=252 → towardSubmenu=false
    expect(snIsAimingAtSubmenu({ x: 250, y: 200 }, { x: 300, y: 200 }, leftRect)).toBe(false);
  });

  it('returns false when curr is within tolerance but outside the triangle', () => {
    // Move very slightly left (within 2px tolerance) but far below submenu
    expect(snIsAimingAtSubmenu({ x: 250, y: 200 }, { x: 249, y: 600 }, leftRect)).toBe(false);
  });
});
