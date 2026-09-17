import type { ObjectId } from "./object-map.ts";

export type ObjectIds = bigint;

export const ObjectIds = {
  empty(): ObjectIds {
    return 0n;
  },

  add(ids: ObjectIds, id: ObjectId): ObjectIds {
    return ids | (1n << BigInt(id));
  },

  has(ids: ObjectIds, id: ObjectId): boolean {
    return ((ids >> BigInt(id)) & 1n) === 1n;
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
