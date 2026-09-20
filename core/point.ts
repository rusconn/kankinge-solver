export type Point = {
  x: number;
  y: number;
};

export const Point = {
  neighbors({ x, y }: Point): Point[] {
    const candidates = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    return candidates.filter(({ x, y }) => x >= 0 && y >= 0);
  },
};
