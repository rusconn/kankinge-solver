import type { Graph } from "./graph.ts";
import type { ObjectId } from "./object-map.ts";
import * as State from "./state.ts";

type State = State.State;

export type Node = {
  depth: number;
  state: State;
};

export function root(objectId: ObjectId): Node {
  return { depth: 0, state: State.initial(objectId) };
}

export function expand({ depth, state }: Node, graph: Graph): Node[] {
  return State.expand(state, graph).map((state) => ({
    depth: depth + 1,
    state,
  }));
}
