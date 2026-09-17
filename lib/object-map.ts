import * as Object from "./object.ts";
import type { Point } from "./point.ts";
import * as Symbol from "./symbols.ts";
import type * as SymbolMap from "./symbol-map.ts";

type Object = Object.Object;
type Symbol = Symbol.Symbol;
type SymbolMap = SymbolMap.SymbolMap;

export type ObjectInstance = Object & {
  id: ObjectId;
  point: Point;
};

export type ObjectId = bigint & { __tag: "ObjectId" };
export type ObjectMap = ReadonlyArray<ReadonlyArray<ObjectInstance>>;
export type ObjectDict = ReadonlyMap<ObjectId, ObjectInstance>;

export function from({
  map: symbolMap,
  start,
  goal,
}: {
  map: SymbolMap;
  start: Point;
  goal: Point;
}): {
  map: ObjectMap;
  start: ObjectInstance;
  goal: ObjectInstance;
  dict: ObjectDict;
} {
  let bit = 1n;

  const map: ObjectMap = symbolMap.map((line, y) =>
    line.map((symbol, x) => {
      const id = bit as ObjectId;
      const object = Symbol.SYMBOLS[symbol];
      const isStart = start.x === x && start.y === y;
      if (
        (!Object.isWall(object) && !Object.isRoad(object)) ||
        isStart
      ) {
        bit <<= 1n;
      }
      return {
        id,
        point: { x, y },
        ...object,
      };
    })
  );

  const dict: ObjectDict = new Map(map.flatMap(
    (row) => row.map((object) => [object.id, object]),
  ));

  return {
    map,
    start: map[start.y]![start.x]!,
    goal: map[goal.y]![goal.x]!,
    dict,
  };
}
