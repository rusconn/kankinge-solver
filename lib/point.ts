export type Point = {
  x: number;
  y: number;
};

export const Point = {
  neighbors({ x, y }: Point): Point[] {
    return [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
  },
};
