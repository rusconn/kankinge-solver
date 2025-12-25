import type { ObjectIds } from "../object-ids.ts";
import type { ObjectInstance } from "../object-map.ts";
import type { Node } from "./node.ts";

export class Frontiers {
  #map = new Map<ObjectInstance, ObjectIds[]>();

  dominates(node: Node): boolean {
    const frontiers = this.#map.get(node.object);
    return frontiers != null &&
      frontiers.every((frontier) => this.#compare(node.blockers, frontier) !== "=");
  }

  add(node: Node): boolean {
    const frontiers = this.#map.get(node.object);

    if (!frontiers) {
      this.#map.set(node.object, [node.blockers]);
      return true;
    }

    for (let i = 0; i < frontiers.length; i++) {
      switch (this.#compare(node.blockers, frontiers[i]!)) {
        case "=":
        case "<":
          return false;
        case ">":
          frontiers.splice(i--, 1);
          continue;
        case "<>":
          continue;
      }
    }

    frontiers.push(node.blockers);
    return true;
  }

  values(): IteratorObject<[ObjectInstance, ObjectIds]> {
    return this.#map.entries().flatMap(([object, frontiers]) =>
      frontiers.map((frontier) => [object, frontier])
    );
  }

  #compare(blockers: ObjectIds, frontier: ObjectIds): "=" | ">" | "<" | "<>" {
    if (blockers.equals(frontier)) return "=";
    if (blockers.isSubsetOf(frontier)) return ">";
    if (blockers.isSupersetOf(frontier)) return "<";
    return "<>";
  }
}
