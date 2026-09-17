import type { Object } from "../object.ts";

const SYMBOLS = {
  a: {
    type: "enemy",
    name: "爺",
    hp: 6358,
    atk: 12,
    def: 10,
  },
  b: {
    type: "enemy",
    name: "緑何か",
    hp: 230,
    atk: 17,
    def: 0,
  },
  c: {
    type: "enemy",
    name: "赤トゲトゲ",
    hp: 250,
    atk: 14,
    def: 1,
  },
  d: {
    type: "enemy",
    name: "青ツンツン",
    hp: 300,
    atk: 14,
    def: 0,
  },
  e: {
    type: "enemy",
    name: "サソリ",
    hp: 230,
    atk: 13,
    def: 2,
  },
  f: {
    type: "enemy",
    name: "青羽",
    hp: 270,
    atk: 13,
    def: 1,
  },
  g: {
    type: "enemy",
    name: "草マン",
    hp: 250,
    atk: 10,
    def: 3,
  },
  h: {
    type: "up",
    kind: "hp",
    name: "hp800",
    amount: 800,
  },
  i: {
    type: "up",
    kind: "atk",
    name: "atk1",
    amount: 1,
  },
  j: {
    type: "up",
    kind: "def",
    name: "def1",
    amount: 1,
  },

  "■": {
    type: "wall",
    name: "wall",
  },

  " ": {
    type: "road",
    name: "road",
  },

  "@": {
    type: "start",
    name: "start",
  },
  "◯": {
    type: "goal",
    name: "goal",
  },
} satisfies Record<string, Object>;

export type Symbol = keyof typeof SYMBOLS;

export const Symbol = {
  SYMBOLS,
};
