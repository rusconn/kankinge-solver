import type { Symbol } from "./symbols.ts";

export type SymbolMap = ReadonlyArray<ReadonlyArray<Symbol>>;

export const SymbolMap = {
  parse(jsonText: string): SymbolMap {
    const { map } = JSON.parse(jsonText) as { map: string[] };
    return map.map((line) => [...line] as Symbol[]);
  },
};
