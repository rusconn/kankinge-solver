import { damage } from "../battle.ts";
import type { Player } from "../object.ts";
import * as State from "../state.ts";
import type { ObjectInstance } from "./object-map.ts";

type State = State.State;

export function tryMove(state: State, dest: ObjectInstance): State | void {
  switch (dest.type) {
    case "up":
      return move(state, dest, (player) => {
        player[dest.kind] += dest.amount;
      });
    case "gate":
      if (dest.kind === "gold" && state.player.obj.gold === 0) return;
      if (dest.kind === "silver" && state.player.obj.silver === 0) return;
      if (dest.kind === "blue" && state.player.obj.blue === 0) return;
      return move(state, dest, (player) => {
        player[dest.kind] -= 1;
      });
    case "enemy":
      const dmg = damage(state.player.obj, dest);
      if (dmg == null) return;
      if (dmg >= state.player.obj.hp) return;
      return move(state, dest, (player) => {
        player.hp -= dmg;
        player.mag += 1;
      });
    case "goal":
      return move(state, dest);
    default:
      throw new Error(`Unexpected tryMove destination: ${dest.type}`);
  }
}

function move(
  oldState: State,
  dest: ObjectInstance,
  modify?: (player: Player) => void,
): State {
  const state = State.clone(oldState);

  // 到着地点へのエッジを削除
  state.player.edges.delete(dest);
  for (const edges of state.graph.values()) {
    edges.delete(dest);
  }

  // 到着地点からのエッジを player からのエッジへマージ
  const destEdges = state.graph.get(dest)!;
  state.player.edges = state.player.edges.union(destEdges);

  // 到着地点を削除
  state.graph.delete(dest);

  // history の更新
  state.history.push({
    type: "move",
    point: dest.point,
    name: dest.name,
  });

  modify?.(state.player.obj);

  return state;
}
