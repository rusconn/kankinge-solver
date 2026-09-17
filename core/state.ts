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
};

export const State = {
  initial(objectId: ObjectId, boundary: BitSet): State {
    return {
      objectId,
      status: Status.initial(),
      erased: BitSet.empty(),
      boundary,
    };
  },

  addChildStates(state: State, stage: Stage, buf: State[]) {
    const dests = destsOf(state.boundary, stage);

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
    }
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
  };
}
