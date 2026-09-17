import { bfs } from "./algorithms/bfs.ts";
import { iddfs } from "./algorithms/iddfs.ts";
import type { Node } from "./algorithms/shared/node.ts";
import type { Config } from "./config.ts";
import { Graph } from "./graph/graph.ts";
import type { ObjectId } from "./graph/object-map.ts";

export * from "./config.ts";

export function run({ mapPath, algorithm }: Config): string | void {
  const { graph, start, goal, dict } = Graph.create(mapPath);
  const node = algorithms[algorithm](graph, start, goal);

  return JSON.stringify(
    node
      ? {
        status: node.state.status.toObject(),
        path: pathOf(node).map((objectId) => {
          const object = dict.get(objectId)!;
          return { point: object.point, name: object.name };
        }),
      }
      : "impossible",
  );
}

function pathOf(node: Node): ObjectId[] {
  const objectIds: ObjectId[] = [];
  for (let current: Node | undefined = node; current?.parent; current = current.parent) {
    if (current.state.objectId !== current.parent!.state.objectId) {
      objectIds.push(current.state.objectId);
    }
  }
  return objectIds.reverse();
}

const algorithms = {
  bfs,
  iddfs,
};
