import { Edges } from "./graph/edges.ts";
import { Object } from "./object.ts";
import type { ObjectId, ObjectInstance, ObjectMap } from "./object-map.ts";

export type Graph = ReadonlyMap<ObjectId, Edges>;

export const Graph = {
  create(map: ObjectMap, start: ObjectInstance): Graph {
    const graph = new Map<ObjectId, Edges>();

    graph.set(start.id, Edges.create(map, start));

    for (const row of map) {
      for (const object of row) {
        if (
          !Object.isWall(object) &&
          !Object.isRoad(object) &&
          !Object.isStart(object) &&
          !Object.isGoal(object)
        ) {
          graph.set(object.id, Edges.create(map, object));
        }
      }
    }

    return graph;
  },
};
