import type { Player } from "../object.ts";
import * as State from "../state.ts";
import type { ConversionKind } from "../state.ts";

type State = State.State;

export function convertions(state: State): State[] {
  const states: State[] = [];

  if (state.player.obj.mag >= 60) {
    const silver = convert(state, (player) => {
      player.mag -= 60;
      player.silver += 1;
      player.level += 3;
      return "silver";
    });

    states.push(silver);
  }
  if (state.player.obj.mag >= 40) {
    const hp = convert(state, (player) => {
      player.mag -= 40;
      player.hp += 500 + 150 * player.level;
      player.level += 2;
      return "hp";
    });

    const atk = convert(state, (player) => {
      player.mag -= 40;
      player.atk += 5 + player.level;
      player.level += 2;
      return "atk";
    });

    const def = convert(state, (player) => {
      player.mag -= 40;
      player.def += 5 + player.level;
      player.level += 2;
      return "def";
    });

    states.push(hp, atk, def);
  }
  if (state.player.obj.mag >= 20) {
    const gold = convert(state, (player) => {
      player.mag -= 20;
      player.gold += 1;
      player.level += 1;
      return "gold";
    });

    states.push(gold);
  }

  return states;
}

function convert(oldState: State, modify: (player: Player) => ConversionKind): State {
  const state = State.clone(oldState);
  const kind = modify(state.player.obj);
  state.history.push({ type: "conversion", kind });
  return state;
}
