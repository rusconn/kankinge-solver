import type { Config } from "../../lib/mod.ts";

export type Strategy = "iddfs";

export function create(args: typeof Deno.args): Config | Error {
  const mapPath = args[0];
  if (mapPath == null) {
    return new Error("USAGE: deno task exec <map_file>");
  }

  return { mapPath };
}
