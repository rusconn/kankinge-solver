import { BitSet } from "../data/bitset.ts";
import { Object } from "../object.ts";
import { Point } from "../point.ts";
import { type ObjectInstance, ObjectMap } from "./object-map.ts";
import { SymbolMap } from "./symbol-map.ts";

export type Stage = {
  objects: ObjectInstance[];
  neighborMasks: BitSet[];
  start: ObjectInstance;
  goal: ObjectInstance;
};

export const Stage = {
  parse(jsonText: string): Stage {
    const symbolMap = SymbolMap.parse(jsonText);
    const objectMap = ObjectMap.create(symbolMap);

    const objects: ObjectInstance[] = [];
    const neighborMasks: BitSet[] = [];
    let start: ObjectInstance | undefined;
    let goal: ObjectInstance | undefined;

    for (const row of objectMap) {
      for (const object of row) {
        if (Object.isWall(object) || Object.isRoad(object)) {
          continue;
        }

        objects[object.id] = object;

        const reached = reachables(objectMap, object);
        let neighborMask = BitSet.empty();
        for (const to of reached) {
          neighborMask = BitSet.add(neighborMask, to.idBit);
        }
        neighborMasks[object.id] = neighborMask;

        if (Object.isStart(object)) {
          start = object;
        }
        if (Object.isGoal(object)) {
          goal = object;
        }
      }
    }

    return {
      objects,
      neighborMasks,
      start: start!,
      goal: goal!,
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
