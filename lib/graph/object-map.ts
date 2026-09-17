import { Object } from "../object.ts";
import type { Point } from "../point.ts";
import { Symbol } from "./symbols.ts";
import type { SymbolMap } from "./symbol-map.ts";

export type ObjectInstance = Object & {
  id: ObjectId;
  point: Point;
};

export type ObjectId = bigint & { __tag: "ObjectId" };
export type ObjectDict = ReadonlyMap<ObjectId, ObjectInstance>;
export type ObjectMap = ReadonlyArray<ReadonlyArray<ObjectInstance>>;

export const ObjectMap = {
  from(input: {
    symbolMap: SymbolMap;
  }): {
    map: ObjectMap;
    start: ObjectInstance;
    goal: ObjectInstance;
    dict: ObjectDict;
  } {
    let bit = 1n;
    let start: ObjectInstance | undefined;
    let goal: ObjectInstance | undefined;

    const map: ObjectMap = input.symbolMap.map((line, y) =>
      line.map((symbol, x) => {
        const instance: ObjectInstance = {
          id: bit as ObjectId,
          point: { x, y },
          ...Symbol.SYMBOLS[symbol],
        };
        if (Object.isStart(instance)) {
          start = instance;
        }
        if (Object.isGoal(instance)) {
          goal = instance;
        }

        if (!Object.isWall(instance) && !Object.isRoad(instance)) {
          bit <<= 1n;
        }

        return instance;
      })
    );

    const dict: ObjectDict = new Map(map.flatMap(
      (row) => row.map((object) => [object.id, object]),
    ));

    return {
      map,
      start: start!,
      goal: goal!,
      dict,
    };
  },
};
