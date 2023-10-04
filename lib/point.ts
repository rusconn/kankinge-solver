export type Point = {
  x: number;
  y: number;
};

export function equals(p: Point, q: Point): boolean {
  return p.x === q.x && p.y === q.y;
}
