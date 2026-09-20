import type { Solution } from "../mod.ts";
import type { Stage } from "../stage/stage.ts";
import { State } from "../state.ts";
import { Frontiers } from "./bfs/frontiers.ts";
import { Node } from "./shared/node.ts";
import { toSolution } from "./shared/solution.ts";

export function bfs(stage: Stage): Solution | void {
  const frontiers = new Frontiers();
  let current = [Node.root(stage.start.id, stage.neighborMasks[stage.start.id]!)];
  let next: Node[] = [];
  const statesBuf: State[] = [];

  for (let depth = 0;; depth++) {
    let searched = 0;
    const begin = Date.now();

    for (const node of current) {
      if (frontiers.isDead(node)) {
        continue;
      }

      ++searched;

      if (node.state.objectId === stage.goal.id) {
        console.error({ depth, searched, timeMs: Date.now() - begin });
        return toSolution(node, stage);
      }

      State.addChildStates(node.state, stage, statesBuf);
      while (statesBuf.length > 0) {
        const state = statesBuf.pop()!;
        const child = Node.child(node, state);
        if (frontiers.offer(child)) {
          next.push(child);
        }
      }
    }

    console.error({ depth, searched, timeMs: Date.now() - begin });

    if (next.length === 0) {
      return;
    }

    current = next;
    next = [];
  }
}
