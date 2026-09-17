import { Config as LibConfig } from "../../lib/mod.ts";

export const Config = {
  create(args: typeof Deno.args): LibConfig | Error {
    const mapPath = args[0];
    if (mapPath == null) {
      return new Error("USAGE: deno task exec <map_file> <bfs|iddfs>");
    }

    const algorithm = args[1];
    if (!LibConfig.isAlgorithm(algorithm)) {
      return new Error("USAGE: deno task exec <map_file> <bfs|iddfs>");
    }

    return { mapPath, algorithm };
  },
};
