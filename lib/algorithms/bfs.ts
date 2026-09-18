import type { World } from "../graph/graph.ts";
import type { ObjectInstance } from "../graph/object-map.ts";
import { State } from "../state.ts";
import { Frontiers } from "./bfs/frontiers.ts";
import { Node } from "./shared/node.ts";

export function bfs(world: World, start: ObjectInstance, goal: ObjectInstance): Node | void {
  const frontiers = new Frontiers();
  let current = [Node.root(start.id, world.neighborMasks[start.id]!)];
  let next: Node[] = [];

  for (let depth = 0;; depth++) {
    let searched = 0;
    const begin = Date.now();

    for (const node of current) {
      if (!node.state.alive) {
        continue;
      }

      ++searched;

      if (node.state.objectId === goal.id) {
        console.error({ depth, searched, timeMs: Date.now() - begin });
        return node;
      }

      for (const state of State.expand(node.state, world)) {
        const child = Node.child(node, state);
        if (frontiers.add(child.state)) {
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
