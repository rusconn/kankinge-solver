import { iddfs } from "./algorithms/iddfs.ts";
import type { Config } from "./config.ts";
import * as Graph from "./graph.ts";
import * as ObjectMap from "./object-map.ts";
import * as SymbolMap from "./symbol-map.ts";

type Graph = Graph.Graph;

export type { Config };

export function run({ mapPath }: Config): string | void {
  const symbolMap = SymbolMap.read(mapPath);
  const objectMap = ObjectMap.from(symbolMap);

  const begin = Date.now();
  const graph = Graph.create(objectMap.map, objectMap.start);
  console.error(`Graph.create: ${Date.now() - begin}ms`);

  const node = algorithms["iddfs"](graph, objectMap.start, objectMap.goal);

  return JSON.stringify(
    node
      ? {
        status: node.state.status.toObject(),
        path: node.state.erased.values()
          .map((objectId) => objectMap.dict.get(objectId)!)
          .map((object) => ({ point: object.point, name: object.name }))
          .toArray(),
      }
      : "impossible",
  );
}

const algorithms = {
  iddfs,
};
