export type Config = {
  mapPath: string;
  algorithm: Algorithm;
};

type Algorithm = "bfs" | "iddfs";

export const Config = {
  isAlgorithm(x: unknown): x is Algorithm {
    return x === "bfs" || x === "iddfs";
  },
};
