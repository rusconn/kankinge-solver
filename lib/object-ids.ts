export type ObjectIds = bigint;

export const ObjectIds = {
  empty(): ObjectIds {
    return 0n;
  },

  add(ids: ObjectIds, bit: bigint): ObjectIds {
    return ids | bit;
  },

  has(ids: ObjectIds, bit: bigint): boolean {
    return (ids & bit) !== 0n;
  },

  equals(a: ObjectIds, b: ObjectIds): boolean {
    return a === b;
  },

  isSupersetOf(ids: ObjectIds, other: ObjectIds): boolean {
    return (ids & other) === other;
  },

  isSubsetOf(ids: ObjectIds, other: ObjectIds): boolean {
    return (ids & other) === ids;
  },
};
