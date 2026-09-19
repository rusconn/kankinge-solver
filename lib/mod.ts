import { bfs } from "./algorithms/bfs.ts";
import { iddfs } from "./algorithms/iddfs.ts";
import type { Node } from "./algorithms/shared/node.ts";
import type { Config } from "./config.ts";
import { Graph } from "./graph/graph.ts";
import type { ObjectId } from "./graph/object-map.ts";

export * from "./config.ts";

export function run({ mapPath, algorithm }: Config): string | void {
  const { graph, start, goal, objects, neighborMasks } = Graph.create(mapPath);
  const world = { graph, objects, neighborMasks };
  const node = algorithms[algorithm](world, start, goal);

  return JSON.stringify(
    node
      ? {
        status: node.state.status,
        path: pathOf(node).map((objectId) => {
          const object = objects[objectId]!;
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
