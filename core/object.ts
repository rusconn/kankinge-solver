export type Enemy = {
  type: "enemy";
  name: string;
  hp: number;
  atk: number;
  def: number;
};

type Hp = {
  type: "up";
  kind: "hp";
  name: string;
  amount: number;
};

type Atk = {
  type: "up";
  kind: "atk";
  name: string;
  amount: number;
};

type Def = {
  type: "up";
  kind: "def";
  name: string;
  amount: number;
};

type Key = {
  type: "up";
  kind: "gold" | "silver" | "blue";
  name: string;
  amount: number;
};

type Crystal = {
  type: "up";
  kind: "crystal";
  name: string;
  amount: number;
};

type Gate = {
  type: "gate";
  kind: "gold" | "silver" | "blue";
  name: string;
};

type Wall = {
  type: "wall";
  name: string;
};

type Road = {
  type: "road";
  name: string;
};

type Start = {
  type: "start";
  name: string;
};

type Goal = {
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
  | Start
  | Goal;

export const Object = {
  isStart(o: Object) {
    return o.type === "start";
  },

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
