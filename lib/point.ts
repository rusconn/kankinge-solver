export type Point = {
  x: number;
  y: number;
};

export const Point = {
  equals(p: Point, q: Point): boolean {
    return p.x === q.x && p.y === q.y;
  },

  neighbors({ x, y }: Point): Point[] {
    return [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
  },
};
