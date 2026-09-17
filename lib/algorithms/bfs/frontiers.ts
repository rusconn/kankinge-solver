import { State } from "../../state.ts";

type Key = string & { __tag: "Key" };

export class Frontiers {
  #map = new Map<Key, State[]>();

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
    return this.#map.get(this.#key(state));
  }

  #set(state: State): void {
    this.#map.set(this.#key(state), [state]);
  }

  #key({ erased }: Pick<State, "erased">): Key {
    // bigintキーだと非常に遅かった
    // V8のBigIntハッシュ関数はほぼ下位ビットしか利用しない。下位ビットがほぼ同じ入力では深刻な衝突を引き起こす。
    // ハッシュ関数が改善されたら不要になる想定
    return erased.toString(36) as Key;
  }
}
