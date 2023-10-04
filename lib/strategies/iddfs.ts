import type { Config } from "../config.ts";
import * as State from "../state.ts";
import * as Node from "./iddfs/node.ts";

type Node = Node.Node;
type State = State.State;

export function run(config: Config): string | void {
  const initState = State.create(config.mapPath);
  const node = iddfs(initState);
  return node && Node.toJSON(node);
}

function iddfs(initState: State): Node | void {
  for (let limit = 0;; limit++) {
    const start = Date.now();
    const { searched, node } = dls(initState, limit);
    console.error({ limit, searched, timeMs: Date.now() - start });
    if (node) return node;
  }
}

function dls(initState: State, limit: number): { searched: number; node?: Node } {
  const nodes = [Node.root(initState)];

  let searched = 0;

  while (nodes.length) {
    const node = nodes.pop()!;

    ++searched;

    if (Node.isGoal(node)) return { searched, node };
    if (node.depth >= limit) continue;

    // 枝刈り: タダで行けるところがあるなら先に行く
    const moved = Node.findAndMoveToNoCost(node);
    if (moved) {
      nodes.push(moved);
      continue;
    }

    nodes.push(...Node.expand(node));
  }

  return { searched };
}
