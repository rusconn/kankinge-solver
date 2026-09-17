export type Enemy = {
  type: "enemy";
  name: string;
  hp: number;
  atk: number;
  def: number;
};

export type Hp = {
  type: "up";
  kind: "hp";
  name: string;
  amount: number;
};

export type Atk = {
  type: "up";
  kind: "atk";
  name: string;
  amount: number;
};

export type Def = {
  type: "up";
  kind: "def";
  name: string;
  amount: number;
};

export type Key = {
  type: "up";
  kind: "gold" | "silver" | "blue";
  name: string;
  amount: number;
};

export type Crystal = {
  type: "up";
  kind: "crystal";
  name: string;
  amount: number;
};

export type Gate = {
  type: "gate";
  kind: "gold" | "silver" | "blue";
  name: string;
};

export type Wall = {
  type: "wall";
  name: string;
};

export type Road = {
  type: "road";
  name: string;
};

export type Goal = {
  type: "goal";
  name: string;
};

export type Object =
  | Enemy
  | Hp
  | Atk
  | Def
  | Key
  | Crystal
  | Gate
  | Wall
  | Road
  | Goal;

export const Object = {
  isGoal(o: Object) {
    return o.type === "goal";
  },

  isWall(o: Object) {
    return o.type === "wall";
  },

  isRoad(o: Object) {
    return o.type === "road";
  },

  isUp(o: Object) {
    return o.type === "up";
  },

  isEnemy(o: Object) {
    return o.type === "enemy";
  },
};
