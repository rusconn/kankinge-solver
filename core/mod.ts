import { bfs } from "./algorithms/bfs.ts";
import { iddfs } from "./algorithms/iddfs.ts";
import type { Point } from "./point.ts";
import type { Stage } from "./stage/stage.ts";
import type { Status } from "./state/status.ts";

export * from "./stage/stage.ts";

export function solve(stage: Stage, algorithm: Algorithm): Solution | null {
  return algorithms[algorithm](stage) ?? null;
}

export type Algorithm = "bfs" | "iddfs";

export const Algorithm = {
  is(s: string): s is Algorithm {
    return s === "bfs" || s === "iddfs";
  },
};

export type Solution = {
  status: Status;
  steps: Step[];
};

export type Step = {
  point: Point;
  name: string;
};

const algorithms = {
  bfs,
  iddfs,
};
