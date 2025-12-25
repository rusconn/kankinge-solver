import type { ObjectId } from "./object-map.ts";

export class ObjectIds implements Iterable<ObjectId> {
  #set: Set<ObjectId>;

  private constructor(set: Set<ObjectId>) {
    this.#set = set;
  }

  static empty(): ObjectIds {
    return new ObjectIds(new Set());
  }

  clone(): ObjectIds {
    return new ObjectIds(new Set(this.#set));
  }

  [Symbol.iterator](): Iterator<ObjectId> {
    return this.values();
  }

  values(): IteratorObject<ObjectId> {
    return this.#set.values();
  }

  add(id: ObjectId): void {
    this.#set.add(id);
  }

  has(id: ObjectId): boolean {
    return this.#set.has(id);
  }

  equals(other: ObjectIds): boolean {
    return (
      this.#set.size === other.#set.size &&
      this.#set.difference(other.#set).size === 0
    );
  }

  isSupersetOf(other: ObjectIds): boolean {
    return this.#set.isSupersetOf(other.#set);
  }

  isSubsetOf(other: ObjectIds): boolean {
    return this.#set.isSubsetOf(other.#set);
  }
}
