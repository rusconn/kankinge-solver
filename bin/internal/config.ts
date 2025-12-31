import { type Config, isAlgorithm } from "../../lib/mod.ts";

export function create(args: typeof Deno.args): Config | Error {
  const mapPath = args[0];
  if (mapPath == null) {
    return new Error("USAGE: deno task exec <map_file> <bfs|iddfs>");
  }
  const algorithm = args[1];
  if (!isAlgorithm(algorithm)) {
    return new Error("USAGE: deno task exec <map_file> <bfs|iddfs>");
  }

  return { mapPath, algorithm };
}
