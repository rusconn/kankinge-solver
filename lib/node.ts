import type { Graph } from "./graph.ts";
import type { ObjectId } from "./object-map.ts";
import * as State from "./state.ts";

type State = State.State;

export type Node = {
  depth: number;
  state: State;
  parent: Node | undefined;
};

export function root(objectId: ObjectId): Node {
  return { depth: 0, state: State.initial(objectId), parent: undefined };
}

export function expand(node: Node, graph: Graph): Node[] {
  return State.expand(node.state, graph).map((state) => ({
    depth: node.depth + 1,
    state,
    parent: node,
  }));
}
