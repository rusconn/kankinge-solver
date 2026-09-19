import { Algorithm } from "../core/mod.ts";

export type Config = {
  stagePath: string;
  algorithm: Algorithm;
};

export const Config = {
  create(args: typeof Deno.args): Config | Error {
    const stagePath = args[0];
    if (stagePath == null) {
      return new Error("USAGE: deno task exec <stage_file> <bfs|iddfs>");
    }

    const algorithm = args[1];
    if (algorithm == null || !Algorithm.is(algorithm)) {
      return new Error("USAGE: deno task exec <stage_file> <bfs|iddfs>");
    }

    return { stagePath, algorithm };
  },
};
