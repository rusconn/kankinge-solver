import { Queue } from "../data/queue.ts";
import { Frontiers } from "../frontiers.ts";
import type { Graph } from "../graph.ts";
import * as Node from "../node.ts";
import type { ObjectInstance } from "../object-map.ts";

type Node = Node.Node;

export function bfs(graph: Graph, start: ObjectInstance, goal: ObjectInstance): Node | void {
  const frontiers = new Frontiers();
  const nodes = Queue.of(Node.root(start.id));

  let searched = 0;
  let begin = Date.now();
  let depth = 0;

  while (!nodes.isEmpty()) {
    const node = nodes.dequeue()!;

    if (node.depth !== depth) {
      console.error({ depth, searched, timeMs: Date.now() - begin });
      searched = 0;
      begin = Date.now();
      depth = node.depth;
    }

    if (frontiers.dominates(node.state)) continue;

    ++searched;

    if (node.state.objectId === goal.id) {
      console.error({ depth, searched, timeMs: Date.now() - begin });
      return node;
    }

    for (const next of Node.expand(node, graph)) {
      if (frontiers.add(next.state)) {
        nodes.enqueue(next);
      }
    }
  }
}
