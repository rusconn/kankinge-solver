import * as State from "../../state.ts";

type State = State.State;

export type Node = {
  state: State;
  depth: number;
};

export function toJSON(node: Node): string {
  return JSON.stringify({
    depth: node.depth,
    player: node.state.player.obj,
    history: node.state.history,
  });
}

export function root(state: State): Node {
  return { state, depth: 0 };
}

export function isGoal(node: Node): boolean {
  return State.isGoal(node.state);
}

export function findAndMoveToNoCost(node: Node): Node | void {
  const state = State.findAndMoveToNoCost(node.state);
  if (state) return { state, depth: node.depth + 1 };
}

export function expand(node: Node): Node[] {
  const states = State.expand(node.state);
  return states.map((state) => ({ state, depth: node.depth + 1 }));
}
