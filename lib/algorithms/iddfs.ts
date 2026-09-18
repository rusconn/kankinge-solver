import type { World } from "../graph/graph.ts";
import type { ObjectInstance } from "../graph/object-map.ts";
import { State } from "../state.ts";
import { Node } from "./shared/node.ts";

export function iddfs(world: World, start: ObjectInstance, goal: ObjectInstance): Node | void {
  for (let limit = 0;; limit++) {
    const begin = Date.now();
    const { searched, node } = dls(world, start, goal, limit);
    console.error({ limit, searched, timeMs: Date.now() - begin });
    if (node) {
      return node;
    }
  }
}

function dls(
  world: World,
  start: ObjectInstance,
  goal: ObjectInstance,
  limit: number,
): { searched: number; node?: Node } {
  const nodes = [Node.root(start.id, world.neighborMasks[start.id]!)];

  let searched = 0;

  while (nodes.length) {
    const node = nodes.pop()!;

    if (node.depth > limit) {
      continue;
    }

    ++searched;

    if (node.state.objectId === goal.id) {
      return { searched, node };
    }

    for (const state of State.expand(node.state, world)) {
      nodes.push(Node.child(node, state));
    }
  }

  return { searched };
}
