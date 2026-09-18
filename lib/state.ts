import { BitSet } from "./data/bitset.ts";
import { Object } from "./object.ts";
import type { World } from "./graph/graph.ts";
import type { ObjectId, ObjectInstance } from "./graph/object-map.ts";
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

  expand(state: State, world: World): State[] {
    const dests = destsOf(state.boundary, world);

    const noCost = dests.find((dest) =>
      Object.isUp(dest) ||
      (Object.isEnemy(dest) && Battle.isNoDmg(state.status, dest)) ||
      Object.isGoal(dest)
    );
    if (noCost) {
      const moved = tryMove(state, noCost, world.neighborMasks[noCost.id]!);
      return [moved!];
    }

    return [
      ...dests
        .map((dest) => tryMove(state, dest, world.neighborMasks[dest.id]!))
        .filter((state) => state != null),
      ...conversions(state),
    ];
  },

  compareStatus(s: State, t: State): "=" | ">" | "<" | "<>" {
    return s.status.compare(t.status);
  },
};

function destsOf(boundary: BitSet, world: World): ObjectInstance[] {
  return BitSet.indexes(boundary).map((id) => world.objects[id]!);
}

function tryMove(
  { status, ...rest }: State,
  dest: ObjectInstance,
  neighborMask: BitSet,
): State | void {
  const cloneState = (): State => ({ ...rest, status: status.clone() });

  switch (dest.type) {
    case "up": {
      const state = cloneState();
      state.status[dest.kind] += dest.amount;
      state.objectId = dest.id;
      state.erased = BitSet.add(state.erased, dest.idBit);
      state.boundary = BitSet.union(
        BitSet.remove(state.boundary, dest.idBit),
        BitSet.difference(neighborMask, state.erased),
      );
      return state;
    }
    case "gate": {
      if (dest.kind === "gold" && status.gold === 0) return;
      if (dest.kind === "silver" && status.silver === 0) return;
      if (dest.kind === "blue" && status.blue === 0) return;
      const state = cloneState();
      state.status[dest.kind] -= 1;
      state.objectId = dest.id;
      state.erased = BitSet.add(state.erased, dest.idBit);
      state.boundary = BitSet.union(
        BitSet.remove(state.boundary, dest.idBit),
        BitSet.difference(neighborMask, state.erased),
      );
      return state;
    }
    case "enemy": {
      const dmg = Battle.damage(status, dest);
      if (dmg == null) return;
      if (dmg >= status.hp) return;
      const state = cloneState();
      state.status.hp -= dmg;
      state.status.mag += 1;
      state.objectId = dest.id;
      state.erased = BitSet.add(state.erased, dest.idBit);
      state.boundary = BitSet.union(
        BitSet.remove(state.boundary, dest.idBit),
        BitSet.difference(neighborMask, state.erased),
      );
      return state;
    }
    case "goal": {
      const state = cloneState();
      state.objectId = dest.id;
      state.erased = BitSet.add(state.erased, dest.idBit);
      state.boundary = BitSet.union(
        BitSet.remove(state.boundary, dest.idBit),
        BitSet.difference(neighborMask, state.erased),
      );
      return state;
    }
    default:
      throw new Error(`Unexpected object type: ${dest.type}`);
  }
}

function conversions({ status, ...rest }: State): State[] {
  const cloneState = (): State => ({ ...rest, status: status.clone() });

  const states: State[] = [];

  if (status.mag >= 60) {
    const silver = cloneState();
    silver.status.mag -= 60;
    silver.status.silver += 1;
    silver.status.level += 3;
    states.push(silver);
  }

  if (status.mag >= 40) {
    const hp = cloneState();
    hp.status.mag -= 40;
    hp.status.hp += 500 + 150 * hp.status.level;
    hp.status.level += 2;
    const atk = cloneState();
    atk.status.mag -= 40;
    atk.status.atk += 5 + atk.status.level;
    atk.status.level += 2;
    const def = cloneState();
    def.status.mag -= 40;
    def.status.def += 5 + def.status.level;
    def.status.level += 2;
    states.push(hp, atk, def);
  }

  if (status.mag >= 20) {
    const gold = cloneState();
    gold.status.mag -= 20;
    gold.status.gold += 1;
    gold.status.level += 1;
    states.push(gold);
  }

  return states;
}
