import type { Symbol } from "./symbols.ts";

export type SymbolMap = ReadonlyArray<ReadonlyArray<Symbol>>;

export const SymbolMap = {
  read(mapPath: string): { symbolMap: SymbolMap } {
    const symbolMapText = Deno.readTextFileSync(mapPath);
    const { map } = JSON.parse(symbolMapText) as { map: string[] };
    const symbolMap = map.map((line) => [...line] as Symbol[]);

    return {
      symbolMap,
    };
  },
};
