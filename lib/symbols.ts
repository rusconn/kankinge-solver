import type { Object } from "./object.ts";

export const SYMBOLS = {
  a: {
    type: "enemy",
    name: "ゴブリン",
    hp: 30,
    atk: 20,
    def: 0,
  },
  b: {
    type: "enemy",
    name: "フードゴブリン",
    hp: 35,
    atk: 10,
    def: 5,
  },
  c: {
    type: "enemy",
    name: "メットゴブリン",
    hp: 75,
    atk: 10,
    def: 5,
  },
  d: {
    type: "enemy",
    name: "青メットゴブリン",
    hp: 60,
    atk: 150,
    def: 5,
  },
  e: {
    type: "enemy",
    name: "ネコ",
    hp: 35,
    atk: 15,
    def: 10,
  },
  f: {
    type: "enemy",
    name: "ヘビ",
    hp: 20,
    atk: 30,
    def: 15,
  },
  g: {
    type: "enemy",
    name: "コウモリ",
    hp: 30,
    atk: 50,
    def: 0,
  },
  h: {
    type: "enemy",
    name: "白トリ",
    hp: 100,
    atk: 25,
    def: 0,
  },
  i: {
    type: "enemy",
    name: "赤トリ",
    hp: 60,
    atk: 70,
    def: 10,
  },
  j: {
    type: "enemy",
    name: "ヤギ",
    hp: 200,
    atk: 40,
    def: 0,
  },
  k: {
    type: "enemy",
    name: "青オオカミ",
    hp: 100,
    atk: 150,
    def: 0,
  },
  l: {
    type: "enemy",
    name: "白オオカミ",
    hp: 200,
    atk: 100,
    def: 0,
  },
  m: {
    type: "enemy",
    name: "赤ミノタウロス",
    hp: 600,
    atk: 30,
    def: 0,
  },
  n: {
    type: "enemy",
    name: "マスタードミノタウロス",
    hp: 200,
    atk: 50,
    def: 15,
  },
  o: {
    type: "enemy",
    name: "マントミノタウロス",
    hp: 600,
    atk: 75,
    def: 0,
  },
  p: {
    type: "enemy",
    name: "触手",
    hp: 50,
    atk: 40,
    def: 10,
  },
  q: {
    type: "enemy",
    name: "オオワシ",
    hp: 1000,
    atk: 40,
    def: 10,
  },
  r: {
    type: "enemy",
    name: "紫オオワシ",
    hp: 300,
    atk: 200,
    def: 50,
  },
  s: {
    type: "enemy",
    name: "紫ハゲオーガ",
    hp: 900,
    atk: 100,
    def: 0,
  },
  t: {
    type: "enemy",
    name: "赤オーガ",
    hp: 150,
    atk: 100,
    def: 35,
  },
  u: {
    type: "enemy",
    name: "緑オーガ",
    hp: 400,
    atk: 250,
    def: 80,
  },
  v: {
    type: "enemy",
    name: "赤スライム",
    hp: 50,
    atk: 15,
    def: 15,
  },
  w: {
    type: "enemy",
    name: "緑スライム",
    hp: 50,
    atk: 80,
    def: 40,
  },
  x: {
    type: "enemy",
    name: "黒スライム",
    hp: 100,
    atk: 180,
    def: 100,
  },
  y: {
    type: "enemy",
    name: "コボルト",
    hp: 150,
    atk: 350,
    def: 0,
  },
  z: {
    type: "enemy",
    name: "幽霊",
    hp: 200,
    atk: 60,
    def: 35,
  },
  A: {
    type: "enemy",
    name: "ヒツジ",
    hp: 200,
    atk: 75,
    def: 75,
  },
  B: {
    type: "enemy",
    name: "黄精霊",
    hp: 30,
    atk: 750,
    def: 80,
  },
  C: {
    type: "enemy",
    name: "紫精霊",
    hp: 100,
    atk: 500,
    def: 100,
  },
  D: {
    type: "enemy",
    name: "赤ゴーレム",
    hp: 1000,
    atk: 200,
    def: 50,
  },
  E: {
    type: "enemy",
    name: "青ゴーレム",
    hp: 2000,
    atk: 400,
    def: 0,
  },
  F: {
    type: "enemy",
    name: "人魂",
    hp: 100,
    atk: 250,
    def: 20,
  },
  G: {
    type: "enemy",
    name: "デビル",
    hp: 200,
    atk: 120,
    def: 30,
  },

  H: {
    type: "up",
    kind: "hp",
    name: "hp300",
    amount: 300,
  },
  I: {
    type: "up",
    kind: "hp",
    name: "hp600",
    amount: 600,
  },
  J: {
    type: "up",
    kind: "hp",
    name: "hp1200",
    amount: 1200,
  },

  K: {
    type: "up",
    kind: "atk",
    name: "atk1",
    amount: 1,
  },
  L: {
    type: "up",
    kind: "atk",
    name: "atk2",
    amount: 2,
  },
  M: {
    type: "up",
    kind: "atk",
    name: "atk4",
    amount: 4,
  },
  N: {
    type: "up",
    kind: "atk",
    name: "atk8",
    amount: 8,
  },
  O: {
    type: "up",
    kind: "atk",
    name: "atk16",
    amount: 16,
  },

  P: {
    type: "up",
    kind: "def",
    name: "def1",
    amount: 1,
  },
  Q: {
    type: "up",
    kind: "def",
    name: "def2",
    amount: 2,
  },
  R: {
    type: "up",
    kind: "def",
    name: "def4",
    amount: 4,
  },
  S: {
    type: "up",
    kind: "def",
    name: "def8",
    amount: 8,
  },
  T: {
    type: "up",
    kind: "def",
    name: "def16",
    amount: 16,
  },

  U: {
    type: "up",
    kind: "gold",
    name: "goldKey",
    amount: 1,
  },
  V: {
    type: "up",
    kind: "silver",
    name: "silverKey",
    amount: 1,
  },
  W: {
    type: "up",
    kind: "blue",
    name: "blueKey",
    amount: 1,
  },

  X: {
    type: "gate",
    kind: "gold",
    name: "goldGate",
  },
  Y: {
    type: "gate",
    kind: "silver",
    name: "silverGate",
  },
  Z: {
    type: "gate",
    kind: "blue",
    name: "blueGate",
  },

  "◆": {
    type: "up",
    kind: "crystal",
    name: "crystal",
    amount: 1,
  },

  "□": {
    type: "wall",
    name: "wall",
  },
  "■": {
    type: "wall",
    name: "wall",
  },

  " ": {
    type: "road",
    name: "road",
  },

  "◯": {
    type: "goal",
    name: "goal",
  },
} satisfies Record<string, Object>;

export type Symbol = keyof typeof SYMBOLS;

export function isSymbol(s: string): s is Symbol {
  return Object.keys(SYMBOLS).includes(s);
}

export function isWall(s: Symbol): boolean {
  return s === "□" || s === "■";
}

export function isRoad(s: Symbol): boolean {
  return s === " ";
}

export function isGoal(s: Symbol): boolean {
  return s === "◯";
}
