import { Object } from "../object.ts";
import type { Point } from "../point.ts";
import { Symbol } from "./symbols.ts";
import type { SymbolMap } from "./symbol-map.ts";

export type ObjectInstance = Object & {
  id: number;
  idBit: bigint;
  point: Point;
};

export type ObjectId = number;
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
    let id = 0;
    let idBit = 1n;
    let start: ObjectInstance | undefined;
    let goal: ObjectInstance | undefined;

    const map: ObjectMap = input.symbolMap.map((line, y) =>
      line.map((symbol, x) => {
        const instance: ObjectInstance = {
          id: -1,
          idBit: 0n,
          point: { x, y },
          ...Symbol.SYMBOLS[symbol],
        };

        if (!Object.isWall(instance) && !Object.isRoad(instance)) {
          instance.id = id++;
          instance.idBit = idBit;
          idBit <<= 1n;
        }

        if (Object.isStart(instance)) {
          start = instance;
        }
        if (Object.isGoal(instance)) {
          goal = instance;
        }

        return instance;
      })
    );

    const dict = new Map<ObjectId, ObjectInstance>();
    for (const row of map) {
      for (const object of row) {
        if (object.id >= 0) {
          dict.set(object.id, object);
        }
      }
    }

    return {
      map,
      start: start!,
      goal: goal!,
      dict,
    };
  },
};
