import { Object } from "../object.ts";
import type { ObjectIds } from "../object-ids.ts";
import { Point } from "../point.ts";
import type { ObjectDict, ObjectInstance, ObjectMap } from "./object-map.ts";
import { ObjectMap as ObjectMapFactory } from "./object-map.ts";
import { SymbolMap } from "./symbol-map.ts";

export type Graph = ReadonlyMap<number, ReadonlySet<ObjectInstance>>;

export type World = {
  graph: Graph;
  objects: ObjectInstance[];
  neighborMasks: ObjectIds[];
};

export const Graph = {
  create(mapPath: string): World & {
    start: ObjectInstance;
    goal: ObjectInstance;
    dict: ObjectDict;
  } {
    const { symbolMap } = SymbolMap.read(mapPath);
    const objectMap = ObjectMapFactory.from({ symbolMap });

    const graph = new Map<number, ReadonlySet<ObjectInstance>>();
    const objects: ObjectInstance[] = [];
    const neighborMasks: ObjectIds[] = [];

    for (const row of objectMap.map) {
      for (const object of row) {
        if (Object.isWall(object) || Object.isRoad(object)) {
          continue;
        }

        objects[object.id] = object;

        const reached = reachables(objectMap.map, object);
        let neighborMask = 0n;
        for (const to of reached) {
          neighborMask |= to.idBit;
        }
        neighborMasks[object.id] = neighborMask;

        if (!Object.isGoal(object)) {
          graph.set(object.id, reached);
        }
      }
    }

    return {
      graph,
      objects,
      neighborMasks,
      start: objectMap.start,
      goal: objectMap.goal,
      dict: objectMap.dict,
    };
  },
};

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
