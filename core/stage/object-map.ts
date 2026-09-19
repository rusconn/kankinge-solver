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
export type ObjectMap = ReadonlyArray<ReadonlyArray<ObjectInstance>>;

export const ObjectMap = {
  create(symbolMap: SymbolMap): ObjectMap {
    let id = 0;
    let idBit = 1n;

    const objectMap: ObjectMap = symbolMap.map((line, y) =>
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

        return instance;
      })
    );

    return objectMap;
  },
};
