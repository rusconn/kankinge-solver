import type { Solution, Stage, Step } from "../../mod.ts";
import type { Node } from "./node.ts";

export function toSolution(node: Node, stage: Stage): Solution {
  const steps: Step[] = [];
  let current: Node | undefined = node;

  while (current != null) {
    const object = stage.objects[current.state.objectId]!;
    steps.push({
      point: object.point,
      name: object.name,
    });
    current = current.parent;
  }

  steps.pop(); // start破棄
  steps.reverse();

  return { status: node.state.status, steps };
}
