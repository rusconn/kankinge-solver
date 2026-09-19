import { BitSet } from "../../data/bitset.ts";
import type { Node } from "../shared/node.ts";
import { State } from "../../state.ts";

type Key = string & { __tag: "Key" };

export class Frontiers {
  #map = new Map<Key, State[]>(); // Node[]にするとGC負荷が増大する
  #dead = new Set<State>();

  offer(node: Node): boolean {
    const key = this.#key(node);

    const frontiers = this.#map.get(key);
    if (!frontiers) {
      this.#map.set(key, [node.state]);
      return true;
    }

    for (let i = 0; i < frontiers.length; i++) {
      switch (State.compareStatus(node.state, frontiers[i]!)) {
        case "=":
        case "<":
          return false;
        case ">":
          this.#dead.add(frontiers[i]!);
          frontiers[i] = frontiers.at(-1)!;
          frontiers.pop();
          i--;
          continue;
        case "<>":
          continue;
      }
    }

    frontiers.push(node.state);
    return true;
  }

  isDead(node: Node): boolean {
    return this.#dead.has(node.state);
  }

  #key(node: Node): Key {
    // bigintキーだと非常に遅かった:
    //   V8のBigIntハッシュ関数はほぼ下位ビットしか利用しない。下位ビットが同じ入力では衝突を引き起こす
    // radixは2の累乗が速いようだ
    // 文字列化ワークアラウンドはハッシュ関数が改善されたら不要になる想定
    return BitSet.toBigInt(node.state.erased).toString(32) as Key;
  }
}
