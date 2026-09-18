import { Queue } from "../data/queue.ts";
import type { World } from "../graph/graph.ts";
import type { ObjectInstance } from "../graph/object-map.ts";
import { Frontiers } from "./bfs/frontiers.ts";
import { Node } from "./shared/node.ts";

export function bfs(world: World, start: ObjectInstance, goal: ObjectInstance): Node | void {
  const frontiers = new Frontiers();
  const nodes = Queue.of(Node.root(start.id, world.neighborMasks[start.id]!));

  let searched = 0;
  let begin = Date.now();
  let depth = 0;

  while (!nodes.isEmpty()) {
    const node = nodes.dequeue()!;

    if (!node.state.alive) {
      continue;
    }

    if (node.depth !== depth) {
      console.error({ depth, searched, timeMs: Date.now() - begin });
      searched = 0;
      begin = Date.now();
      depth = node.depth;
    }

    ++searched;

    if (node.state.objectId === goal.id) {
      console.error({ depth, searched, timeMs: Date.now() - begin });
      return node;
    }

    for (const next of Node.expand(node, world)) {
      if (frontiers.add(next.state)) {
        nodes.enqueue(next);
      }
    }
  }
}
