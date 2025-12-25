import { Queue } from "../data/queue.ts";
import { Frontiers } from "../graph/frontiers.ts";
import * as Node from "../graph/node.ts";
import * as Object from "../object.ts";
import type { ObjectIds } from "../object-ids.ts";
import type { ObjectInstance, ObjectMap } from "../object-map.ts";

export type Edges = ReadonlySet<{
  to: ObjectInstance;
  blockers: ObjectIds;
}>;

// TODO: 高速化
export function create(map: ObjectMap, start: ObjectInstance): Edges {
  const frontiers = new Frontiers();

  const nodes = Queue.of(Node.root(start));

  while (!nodes.isEmpty()) {
    const node = nodes.dequeue()!;

    if (frontiers.dominates(node)) continue;

    for (const next of Node.expand(node, map, start)) {
      if (frontiers.add(next)) {
        nodes.enqueue(next);
      }
    }
  }

  return new Set(
    frontiers.values()
      .filter(([object]) => !Object.isRoad(object))
      .map(([object, objectIds]) => ({ to: object, blockers: objectIds })),
  );
}
