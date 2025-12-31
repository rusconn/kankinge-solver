import * as State from "./state.ts";

type State = State.State;

type Key = string & { __tag: "Key" };

export class Frontiers {
  #map = new Map<Key, State[]>();

  dominates(state: State): boolean {
    const frontiers = this.#get(state);
    return frontiers != null &&
      frontiers.every((frontier) => State.compareStatus(state, frontier) !== "=");
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
    return this.#map.get(this.#key(state));
  }

  #set(state: State): void {
    this.#map.set(this.#key(state), [state]);
  }

  #key({ erased }: Pick<State, "erased">): Key {
    return [...erased].sort().toString() as Key;
  }
}
