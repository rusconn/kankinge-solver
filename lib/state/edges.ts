import * as Object from "../object.ts";
import * as Point from "../point.ts";
import type * as ObjectMap from "./object-map.ts";
import type { ObjectInstance } from "./object-map.ts";

type Point = Point.Point;
type ObjectMap = ObjectMap.ObjectMap;

export type Edges = Set<ObjectInstance>;

export function create(objects: ObjectMap, start: Point): Edges {
  const edges = new Set<ObjectInstance>();
  const visited = new Set<ObjectInstance>();

  const stack = [start];

  while (stack.length) {
    const point = stack.pop()!;
    const { x, y } = point;
    const obj = objects.at(y)?.at(x);

    if (x < 0 || y < 0) continue;
    if (obj == null) continue;
    if (visited.has(obj)) continue;
    if (Object.isWall(obj)) continue;

    visited.add(obj);

    if (Object.isRoad(obj) || Point.equals(point, start)) {
      stack.push(
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
      );
    } else if (!Object.isPlayer(obj)) {
      edges.add(obj);
    }
  }

  return edges;
}
