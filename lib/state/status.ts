const statusKeys = [
  "hp",
  "atk",
  "def",
  "gold",
  "silver",
  "blue",
  "mag",
  "level",
  "crystal",
] as const;

type StatusObject = Record<typeof statusKeys[number], number>;

export class Status {
  #status: StatusObject;

  private constructor(status: StatusObject) {
    this.#status = status;
  }

  static initial(): Status {
    return new Status({
      hp: 150,
      atk: 10,
      def: 0,
      gold: 0,
      silver: 0,
      blue: 0,
      mag: 0,
      level: 0,
      crystal: 0,
    });
  }

  clone(): Status {
    return new Status({ ...this.#status });
  }

  get hp(): number {
    return this.#status.hp;
  }
  set hp(value: number) {
    this.#status.hp = value;
  }

  get atk(): number {
    return this.#status.atk;
  }
  set atk(value: number) {
    this.#status.atk = value;
  }

  get def(): number {
    return this.#status.def;
  }
  set def(value: number) {
    this.#status.def = value;
  }

  get gold(): number {
    return this.#status.gold;
  }
  set gold(value: number) {
    this.#status.gold = value;
  }

  get silver(): number {
    return this.#status.silver;
  }
  set silver(value: number) {
    this.#status.silver = value;
  }

  get blue(): number {
    return this.#status.blue;
  }
  set blue(value: number) {
    this.#status.blue = value;
  }

  get mag(): number {
    return this.#status.mag;
  }
  set mag(value: number) {
    this.#status.mag = value;
  }

  get level(): number {
    return this.#status.level;
  }
  set level(value: number) {
    this.#status.level = value;
  }

  get crystal(): number {
    return this.#status.crystal;
  }
  set crystal(value: number) {
    this.#status.crystal = value;
  }

  compare(other: Status): "=" | ">" | "<" | "<>" {
    let sGt = false;
    let tGt = false;

    for (const key of statusKeys) {
      if (this[key] === other[key]) {
        continue;
      }
      if (this[key] > other[key]) {
        sGt = true;
      } else {
        tGt = true;
      }
      if (sGt && tGt) return "<>";
    }

    return sGt ? ">" : tGt ? "<" : "=";
  }

  toObject(): StatusObject {
    return { ...this.#status };
  }
}
