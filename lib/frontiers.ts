import * as State from "./state.ts";
import type { ObjectIds } from "./object-ids.ts";

type State = State.State;

export class Frontiers {
  #map = new Map<ObjectIds, State[]>();

  dominates(state: State): boolean {
    const frontiers = this.#get(state);
    return frontiers != null && !frontiers.includes(state);
  }

  add(state: State): boolean {
    const frontiers = this.#get(state);

    if (!frontiers) {
      this.#set(state);
      return true;
    }

    for (let i = 0; i < frontiers.length; i++) {
      switch (State.compareStatus(state, frontiers[i]!)) {
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

    frontiers.push(state);
    return true;
  }

  #get(state: State): State[] | undefined {
    return this.#map.get(state.erased);
  }

  #set(state: State): void {
    this.#map.set(state.erased, [state]);
  }
}
