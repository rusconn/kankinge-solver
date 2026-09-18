import { BitSet } from "../../data/bitset.ts";
import { State } from "../../state.ts";

type Key = string & { __tag: "Key" };

export class Frontiers {
  #map = new Map<Key, State[]>();

  dominates(state: State): boolean {
    const frontiers = this.#map.get(this.#key(state));
    return frontiers != null && !frontiers.includes(state);
  }

  add(state: State): boolean {
    const key = this.#key(state);

    const frontiers = this.#map.get(key);
    if (!frontiers) {
      this.#map.set(key, [state]);
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

  #key({ erased }: Pick<State, "erased">): Key {
    // bigintキーだと非常に遅かった:
    //   V8のBigIntハッシュ関数はほぼ下位ビットしか利用しない。下位ビットが同じ入力では衝突を引き起こす
    // radixは2の累乗が速いようだ
    // 文字列化ワークアラウンドはハッシュ関数が改善されたら不要になる想定
    return BitSet.toBigInt(erased).toString(32) as Key;
  }
}
