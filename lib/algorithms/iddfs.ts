import type { Graph } from "../graph/graph.ts";
import type { ObjectInstance } from "../graph/object-map.ts";
import { Node } from "./shared/node.ts";

export function iddfs(graph: Graph, start: ObjectInstance, goal: ObjectInstance): Node | void {
  for (let limit = 0;; limit++) {
    const begin = Date.now();
    const { searched, node } = dls(graph, start, goal, limit);
    console.error({ limit, searched, timeMs: Date.now() - begin });
    if (node) {
      return node;
    }
  }
}

function dls(
  graph: Graph,
  start: ObjectInstance,
  goal: ObjectInstance,
  limit: number,
): { searched: number; node?: Node } {
  const nodes = [Node.root(start.id)];

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

    nodes.push(...Node.expand(node, graph));
  }

  return { searched };
}
