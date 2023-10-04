import { isNoDmg } from "./battle.ts";
import * as Object from "./object.ts";
import type { Point } from "./point.ts";
import { convertions } from "./state/convert.ts";
import * as Graph from "./state/graph.ts";
import type { PlayerState } from "./state/graph.ts";
import { tryMove } from "./state/move.ts";

type Object = Object.Object;
type Graph = Graph.Graph;

export type State = {
  player: PlayerState;
  graph: Graph;
  history: Action[];
};

type Action = Move | Conversion;
type Move = { type: "move"; point: Point; name: Object["name"] };
type Conversion = { type: "conversion"; kind: ConversionKind };
export type ConversionKind = "hp" | "atk" | "def" | "gold" | "silver";

export function create(mapPath: string): State {
  const { player, graph } = Graph.create(mapPath);
  return { player, graph, history: [] };
}

export function isGoal(state: State): boolean {
  const lastAction = state.history.at(-1);
  return lastAction?.type === "move" &&
    lastAction?.name === "goal" &&
    state.player.obj.crystal >= 3;
}

export function findAndMoveToNoCost(state: State): State | void {
  const noCost = state.player.edges.values().find((obj) =>
    Object.isUp(obj) || (Object.isEnemy(obj) && isNoDmg(state.player.obj, obj))
  );
  if (noCost) return tryMove(state, noCost)!;
}

export function expand(state: State): State[] {
  const moveStates = state.player.edges.values()
    .map((obj) => tryMove(state, obj))
    .filter((state) => state != null);

  const stayedStates = convertions(state);

  return [...moveStates, ...stayedStates];
}

/**
 * 各オブジェクトへの参照を維持しつつstate全体を複製する
 */
export function clone({ player, graph, history }: State): State {
  return {
    player: {
      obj: { ...player.obj },
      edges: new Set(player.edges),
    },
    graph: new Map(graph.entries().map(([obj, edges]) => [obj, new Set(edges)])),
    history: [...history],
  };
}
