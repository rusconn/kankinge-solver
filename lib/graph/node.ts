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

  expand(node: Node, map: ObjectMap, start: ObjectInstance): Node[] {
    return Point.neighbors(node.object.point)
      .filter((point) => !Point.equals(point, start.point))
      .filter((point) => {
        const object = map[point.y]?.[point.x];
        return object && !Object.isWall(object);
      })
      .map((point) => {
        const object = map[point.y]![point.x]!;
        const next = { object, blockers: node.blockers };

        if (
          !Point.equals(node.object.point, start.point) && (
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
