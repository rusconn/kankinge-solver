declare const tag: unique symbol;

export type BitSet = bigint & { readonly [tag]: unique symbol };

export const BitSet = {
  empty(): BitSet {
    return 0n as BitSet;
  },

  add(set: BitSet, bit: bigint): BitSet {
    return (set | bit) as BitSet;
  },

  has(set: BitSet, bit: bigint): boolean {
    return (set & bit) !== 0n;
  },

  remove(set: BitSet, bit: bigint): BitSet {
    return (set & ~bit) as BitSet;
  },

  union(a: BitSet, b: BitSet): BitSet {
    return (a | b) as BitSet;
  },

  difference(set: BitSet, other: BitSet): BitSet {
    return (set & ~other) as BitSet;
  },

  isSupersetOf(set: BitSet, other: BitSet): boolean {
    return (set & other) === other;
  },

  isSubsetOf(set: BitSet, other: BitSet): boolean {
    return (set & other) === set;
  },

  equals(a: BitSet, b: BitSet): boolean {
    return a === b;
  },

  indexes(set: BitSet): number[] {
    const indexes: number[] = [];
    let bits: bigint = set;

    while (bits !== 0n) {
      const lowbit = bits & -bits;
      indexes.push(Math.log2(Number(lowbit)));
      bits ^= lowbit;
    }

    return indexes;
  },

  toBigInt(set: BitSet): bigint {
    return set;
  },
};
