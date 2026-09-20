import type { Solution } from "../mod.ts";
import type { Stage } from "../stage/stage.ts";
import { State } from "../state.ts";
import { Node } from "./shared/node.ts";
import { toSolution } from "./shared/solution.ts";

export function iddfs(stage: Stage): Solution | void {
  for (let limit = 0;; limit++) {
    const begin = Date.now();
    const { searched, node } = dls(stage, limit);
    console.error({ limit, searched, timeMs: Date.now() - begin });
    if (node) {
      return toSolution(node, stage);
    }
  }
}

function dls(stage: Stage, limit: number): { searched: number; node?: Node } {
  const nodes = [Node.root(stage.start.id, stage.neighborMasks[stage.start.id]!)];
  const statesBuf: State[] = [];

  let searched = 0;

  while (nodes.length) {
    const node = nodes.pop()!;

    if (node.depth > limit) {
      continue;
    }

    ++searched;

    if (node.state.objectId === stage.goal.id) {
      return { searched, node };
    }

    State.addChildStates(node.state, stage, statesBuf);
    while (statesBuf.length > 0) {
      const state = statesBuf.pop()!;
      nodes.push(Node.child(node, state));
    }
  }

  return { searched };
}
