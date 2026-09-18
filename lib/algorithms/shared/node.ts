import type { World } from "../../graph/graph.ts";
import type { ObjectId } from "../../graph/object-map.ts";
import type { ObjectIds } from "../../object-ids.ts";
import { State } from "../../state.ts";

export type Node = {
  depth: number;
  state: State;
  parent: Node | undefined;
};

export const Node = {
  root(objectId: ObjectId, boundary: ObjectIds): Node {
    return { depth: 0, state: State.initial(objectId, boundary), parent: undefined };
  },

  expand(node: Node, world: World): Node[] {
    return State.expand(node.state, world).map((state) => ({
      depth: node.depth + 1,
      state,
      parent: node,
    }));
  },
};
