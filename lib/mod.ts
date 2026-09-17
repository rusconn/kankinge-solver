import { bfs } from "./algorithms/bfs.ts";
import { iddfs } from "./algorithms/iddfs.ts";
import type { Config } from "./config.ts";
import * as Graph from "./graph.ts";
import type { Node } from "./node.ts";
import type { ObjectId } from "./object-map.ts";
import * as ObjectMap from "./object-map.ts";
import * as SymbolMap from "./symbol-map.ts";

type Graph = Graph.Graph;

export * from "./config.ts";

export function run({ mapPath, algorithm }: Config): string | void {
  const symbolMap = SymbolMap.read(mapPath);
  const objectMap = ObjectMap.from(symbolMap);

  const begin = Date.now();
  const graph = Graph.create(objectMap.map, objectMap.start);
  console.error(`Graph.create: ${Date.now() - begin}ms`);

  const node = algorithms[algorithm](graph, objectMap.start, objectMap.goal);

  return JSON.stringify(
    node
      ? {
        status: node.state.status.toObject(),
        path: pathOf(node).map((objectId) => {
          const object = objectMap.dict.get(objectId)!;
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
