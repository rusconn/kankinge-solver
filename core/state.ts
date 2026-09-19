import { BitSet } from "./data/bitset.ts";
import { Object } from "./object.ts";
import type { Stage } from "./stage/stage.ts";
import type { ObjectId, ObjectInstance } from "./stage/object-map.ts";
import { Battle } from "./state/battle.ts";
import { Status } from "./state/status.ts";

export type State = {
  objectId: ObjectId;
  status: Status;
  erased: BitSet;
  boundary: BitSet;
  alive: boolean;
};

export const State = {
  initial(objectId: ObjectId, boundary: BitSet): State {
    return {
      objectId,
      status: Status.initial(),
      erased: BitSet.empty(),
      boundary,
      alive: true,
    };
  },

  expand(state: State, stage: Stage): State[] {
    const dests = destsOf(state.boundary, stage);
    const buf: State[] = [];

    const noCost = dests.find((dest) =>
      Object.isUp(dest) ||
      (Object.isEnemy(dest) && Battle.isNoDmg(state.status, dest)) ||
      Object.isGoal(dest)
    );
    if (noCost) {
      addMovedState(state, noCost, stage.neighborMasks[noCost.id]!, buf);
    } else {
      for (const dest of dests) {
        addMovedState(state, dest, stage.neighborMasks[dest.id]!, buf);
      }
      addConvertedStates(state, buf);
    }

    return buf;
  },

  compareStatus(s: State, t: State): "=" | ">" | "<" | "<>" {
    return Status.compare(s.status, t.status);
  },
};

function destsOf(boundary: BitSet, stage: Stage): ObjectInstance[] {
  return BitSet.indexes(boundary).map((id) => stage.objects[id]!);
}

function addMovedState(
  state: State,
  dest: ObjectInstance,
  neighborMask: BitSet,
  buf: State[],
): void {
  switch (dest.type) {
    case "up": {
      const status = Status.clone(state.status);
      status[dest.kind] += dest.amount;
      buf.push(moved(status, state, dest, neighborMask));
      return;
    }
    case "gate": {
      if (dest.kind === "gold" && state.status.gold === 0) return;
      if (dest.kind === "silver" && state.status.silver === 0) return;
      if (dest.kind === "blue" && state.status.blue === 0) return;
      const status = Status.clone(state.status);
      status[dest.kind] -= 1;
      buf.push(moved(status, state, dest, neighborMask));
      return;
    }
    case "enemy": {
      const dmg = Battle.damage(state.status, dest);
      if (dmg == null) return;
      if (dmg >= state.status.hp) return;
      const status = Status.clone(state.status);
      status.hp -= dmg;
      status.mag += 1;
      buf.push(moved(status, state, dest, neighborMask));
      return;
    }
    case "goal": {
      const status = Status.clone(state.status);
      buf.push(moved(status, state, dest, neighborMask));
      return;
    }
    default:
      throw new Error(`Unexpected object type: ${dest.type}`);
  }
}

function moved(status: Status, state: State, dest: ObjectInstance, neighborMask: BitSet): State {
  return {
    objectId: dest.id,
    status,
    erased: BitSet.add(state.erased, dest.idBit),
    boundary: BitSet.union(
      BitSet.remove(state.boundary, dest.idBit),
      BitSet.difference(neighborMask, state.erased),
    ),
    alive: state.alive,
  };
}

function addConvertedStates(state: State, buf: State[]): void {
  const { status } = state;

  if (status.mag >= 60) {
    const silver = Status.clone(status);
    silver.mag -= 60;
    silver.silver += 1;
    silver.level += 3;
    buf.push(converted(state, silver));
  }

  if (status.mag >= 40) {
    const hp = Status.clone(status);
    hp.mag -= 40;
    hp.hp += 500 + 150 * hp.level;
    hp.level += 2;
    const atk = Status.clone(status);
    atk.mag -= 40;
    atk.atk += 5 + atk.level;
    atk.level += 2;
    const def = Status.clone(status);
    def.mag -= 40;
    def.def += 5 + def.level;
    def.level += 2;
    buf.push(converted(state, hp), converted(state, atk), converted(state, def));
  }

  if (status.mag >= 20) {
    const gold = Status.clone(status);
    gold.mag -= 20;
    gold.gold += 1;
    gold.level += 1;
    buf.push(converted(state, gold));
  }
}

function converted(state: State, status: Status): State {
  return { ...state, status };
}
