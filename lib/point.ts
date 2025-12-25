export type Point = {
  x: number;
  y: number;
};

export function equals(p: Point, q: Point): boolean {
  return p.x === q.x && p.y === q.y;
}

export function neighbors({ x, y }: Point): Point[] {
  return [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y },
  ];
}
