import type { BitSet } from "../../data/bitset.ts";
import type { ObjectId } from "../../graph/object-map.ts";
import { State } from "../../state.ts";

export type Node = {
  depth: number;
  state: State;
  parent: Node | undefined;
};

export const Node = {
  root(objectId: ObjectId, boundary: BitSet): Node {
    return { depth: 0, state: State.initial(objectId, boundary), parent: undefined };
  },

  child(parent: Node, state: State): Node {
    return { depth: parent.depth + 1, state, parent };
  },
};
