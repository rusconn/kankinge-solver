import { Object } from "../object.ts";
import { Edges } from "./edges.ts";
import type { ObjectDict, ObjectId, ObjectInstance } from "./object-map.ts";
import { ObjectMap as ObjectMapFactory } from "./object-map.ts";
import { SymbolMap } from "./symbol-map.ts";

export type Graph = ReadonlyMap<ObjectId, Edges>;

export const Graph = {
  create(mapPath: string): {
    graph: Graph;
    start: ObjectInstance;
    goal: ObjectInstance;
    dict: ObjectDict;
  } {
    const { symbolMap } = SymbolMap.read(mapPath);
    const objectMap = ObjectMapFactory.from({ symbolMap });

    const graph = new Map<ObjectId, Edges>();

    graph.set(objectMap.start.id, Edges.create(objectMap.map, objectMap.start));

    for (const row of objectMap.map) {
      for (const object of row) {
        if (
          !Object.isWall(object) &&
          !Object.isRoad(object) &&
          !Object.isStart(object) &&
          !Object.isGoal(object)
        ) {
          graph.set(object.id, Edges.create(objectMap.map, object));
        }
      }
    }

    return {
      graph,
      start: objectMap.start,
      goal: objectMap.goal,
      dict: objectMap.dict,
    };
  },
};
