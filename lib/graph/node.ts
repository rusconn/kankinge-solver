import * as Object from "../object.ts";
import { ObjectIds } from "../object-ids.ts";
import type { ObjectInstance, ObjectMap } from "../object-map.ts";
import * as Point from "../point.ts";

export type Node = {
  object: ObjectInstance;
  blockers: ObjectIds;
};

export function root(start: ObjectInstance): Node {
  return { object: start, blockers: ObjectIds.empty() };
}

export function expand(node: Node, map: ObjectMap, start: ObjectInstance): Node[] {
  return (
    Point.neighbors(node.object.point)
      .filter((point) => !Point.equals(point, start.point))
      .filter((point) => {
        const object = map[point.y]?.[point.x];
        return object && !Object.isWall(object);
      })
      .map((point) => {
        const object = map[point.y]![point.x]!;
        const next = { object, blockers: node.blockers.clone() };

        if (
          !Point.equals(node.object.point, start.point) && (
            node.object.type === "up" ||
            node.object.type === "enemy" ||
            node.object.type === "gate"
          )
        ) {
          next.blockers.add(node.object.id);
        }

        return next;
      })
  );
}
