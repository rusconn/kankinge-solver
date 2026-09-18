import { Object } from "../object.ts";
import { ObjectIds } from "../object-ids.ts";
import { Point } from "../point.ts";
import type { ObjectDict, ObjectInstance, ObjectMap } from "./object-map.ts";
import { ObjectMap as ObjectMapFactory } from "./object-map.ts";
import { SymbolMap } from "./symbol-map.ts";

export type Graph = ReadonlyMap<number, ReadonlySet<ObjectInstance>>;

export const Graph = {
  create(mapPath: string): {
    graph: Graph;
    start: ObjectInstance;
    goal: ObjectInstance;
    dict: ObjectDict;
  } {
    const { symbolMap } = SymbolMap.read(mapPath);
    const objectMap = ObjectMapFactory.from({ symbolMap });

    const graph = new Map<number, ReadonlySet<ObjectInstance>>();

    for (const row of objectMap.map) {
      for (const object of row) {
        if (isOrigin(object)) {
          graph.set(ObjectIds.index(object.id), reachables(objectMap.map, object));
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

function isOrigin(object: ObjectInstance): boolean {
  return (
    !Object.isWall(object) &&
    !Object.isRoad(object) &&
    !Object.isGoal(object)
  );
}

function reachables(map: ObjectMap, start: ObjectInstance): ReadonlySet<ObjectInstance> {
  const reached = new Set<ObjectInstance>();
  const visited = new Set<ObjectInstance>();
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (visited.has(node)) {
      continue;
    }

    visited.add(node);

    for (const next of neighbors(map, node.point)) {
      if (visited.has(next)) {
        continue;
      }
      if (Object.isRoad(next) || Object.isStart(next)) {
        stack.push(next);
      } else if (!Object.isWall(next)) {
        reached.add(next);
      }
    }
  }

  return reached;
}

function neighbors(map: ObjectMap, point: { x: number; y: number }): ObjectInstance[] {
  return Point.neighbors(point)
    .map((point) => map[point.y]?.[point.x])
    .filter((object): object is ObjectInstance => object != null);
}
