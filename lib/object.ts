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

export type Player = {
  type: "player";
  name: "player";
  hp: number;
  atk: number;
  def: number;
  gold: number;
  silver: number;
  blue: number;
  mag: number;
  level: number;
  crystal: number;
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
  | Goal
  | Player;

export function isPlayer(o: Object) {
  return o.type === "player";
}

export function isWall(o: Object) {
  return o.type === "wall";
}

export function isRoad(o: Object) {
  return o.type === "road";
}

export function isUp(o: Object) {
  return o.type === "up";
}

export function isEnemy(o: Object) {
  return o.type === "enemy";
}
