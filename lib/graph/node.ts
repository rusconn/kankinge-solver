import { Object } from "../object.ts";
import { ObjectIds } from "../object-ids.ts";
import type { ObjectInstance, ObjectMap } from "../object-map.ts";
import { Point } from "../point.ts";

export type Node = {
  object: ObjectInstance;
  blockers: ObjectIds;
};

export const Node = {
  root(start: ObjectInstance): Node {
    return { object: start, blockers: ObjectIds.empty() };
  },

  expand(node: Node, map: ObjectMap): Node[] {
    return Point.neighbors(node.object.point)
      .map((point) => map[point.y]?.[point.x])
      .filter((object) =>
        object &&
        !Object.isWall(object) &&
        !Object.isStart(object)
      )
      .map((object) => {
        const next = { object: object!, blockers: node.blockers };

        if (
          !Object.isStart(node.object) && (
            node.object.type === "up" ||
            node.object.type === "enemy" ||
            node.object.type === "gate"
          )
        ) {
          next.blockers = ObjectIds.add(next.blockers, node.object.id);
        }

        return next;
      });
  },
};
