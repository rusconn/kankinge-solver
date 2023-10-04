import type { Object } from "../object.ts";
import type { Point } from "../point.ts";
import { isSymbol, SYMBOLS } from "../symbols.ts";

export type ObjectMap = ObjectInstance[][];

export type ObjectInstance = Object & {
  point: Point;
};

export function create(mapPath: string): ObjectMap {
  let text;
  try {
    text = Deno.readTextFileSync(mapPath);
  } catch (e) {
    throw new Error(`Failed to read the map file: ${(e as Error).message}`);
  }

  let rows;
  try {
    rows = JSON.parse(text) as unknown;
  } catch (e) {
    throw new Error(`Failed to parse the map file: ${(e as Error).message}`);
  }

  if (!Array.isArray(rows) || rows.some((row) => typeof row !== "string")) {
    throw new Error("Invalid map file contents");
  }

  if (!text.includes("◯")) {
    throw new Error("Couldn't find a goal symbol");
  }
  if (!text.includes("@")) {
    throw new Error("Couldn't find a player symbol");
  }

  const objects: ObjectMap = [];

  for (const [y, row] of (rows as string[]).entries()) {
    const v: ObjectMap[number] = [];

    for (const [x, symbol] of [...row].entries()) {
      if (!isSymbol(symbol)) throw new Error(`Unknown symbol: ${symbol}`);
      const obj = SYMBOLS[symbol];
      v.push({ ...obj, point: { x, y } });
    }

    objects.push(v);
  }

  return objects;
}
