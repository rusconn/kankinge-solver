import type { ObjectId } from "./graph/object-map.ts";

export type ObjectIds = bigint;

export const ObjectIds = {
  empty(): ObjectIds {
    return 0n;
  },

  add(ids: ObjectIds, id: ObjectId): ObjectIds {
    return ids | id;
  },

  has(ids: ObjectIds, id: ObjectId): boolean {
    return (ids & id) !== 0n;
  },

  // ObjectIdは2^kの形なので、密な番号0..n-1に一意に変換できる
  index(id: ObjectId): number {
    return Math.log2(Number(id));
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
