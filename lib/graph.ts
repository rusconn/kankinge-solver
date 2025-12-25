import * as Edges from "./graph/edges.ts";
import * as Object from "./object.ts";
import type { ObjectId, ObjectInstance, ObjectMap } from "./object-map.ts";

type Edges = Edges.Edges;

export type Graph = ReadonlyMap<ObjectId, Edges>;

export function create(map: ObjectMap, start: ObjectInstance): Graph {
  const graph = new Map<ObjectId, Edges>();

  graph.set(start.id, Edges.create(map, start));

  for (const row of map) {
    for (const object of row) {
      if (
        !Object.isWall(object) &&
        !Object.isRoad(object) &&
        !Object.isGoal(object)
      ) {
        graph.set(object.id, Edges.create(map, object));
      }
    }
  }

  return graph;
}
