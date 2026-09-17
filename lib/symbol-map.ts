import type { Point } from "./point.ts";
import { Symbol } from "./symbols.ts";

export type SymbolMap = ReadonlyArray<ReadonlyArray<Symbol>>;

export const SymbolMap = {
  read(mapPath: string): { start: Point; goal: Point; map: SymbolMap } {
    const symbolMapText = Deno.readTextFileSync(mapPath);
    const { start, map } = JSON.parse(symbolMapText) as { start: Point; map: string[] };
    const symbolMap = map.map((line) => [...line] as Symbol[]);

    let goal: Point = { x: -1, y: -1 };
    for (const [y, row] of symbolMap.entries()) {
      for (const [x, symbol] of row.entries()) {
        if (Symbol.isGoal(symbol)) {
          goal = { x, y };
        }
      }
    }

    return {
      start,
      goal,
      map: symbolMap,
    };
  },
};
