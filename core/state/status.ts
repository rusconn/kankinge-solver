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

export type Status = Record<(typeof statusKeys)[number], number>;

export const Status = {
  initial(): Status {
    return {
      hp: 1000,
      atk: 5,
      def: 5,
      gold: 0,
      silver: 0,
      blue: 0,
      mag: 0,
      level: 0,
      crystal: 0,
    };
  },

  clone(status: Status): Status {
    return { ...status };
  },

  compare(a: Status, b: Status): "=" | ">" | "<" | "<>" {
    let aGt = false;
    let bGt = false;

    for (const key of statusKeys) {
      if (a[key] === b[key]) {
        continue;
      }
      if (a[key] > b[key]) {
        aGt = true;
      } else {
        bGt = true;
      }
      if (aGt && bGt) return "<>";
    }

    return aGt ? ">" : bGt ? "<" : "=";
  },
};
