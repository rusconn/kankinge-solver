import { Object } from "./object.ts";
import { ObjectIds } from "./object-ids.ts";
import type { Graph } from "./graph/graph.ts";
import type { ObjectId, ObjectInstance } from "./graph/object-map.ts";
import { Battle } from "./state/battle.ts";
import { Status } from "./state/status.ts";

export type State = {
  objectId: ObjectId;
  status: Status;
  erased: ObjectIds;
};

export const State = {
  initial(objectId: ObjectId): State {
    return {
      objectId,
      status: Status.initial(),
      erased: ObjectIds.empty(),
    };
  },

  expand(state: State, graph: Graph): State[] {
    const dests = reachables(state, graph);

    const noCost = dests.find((dest) =>
      Object.isUp(dest) || (Object.isEnemy(dest) && Battle.isNoDmg(state.status, dest))
    );
    if (noCost) {
      const moved = tryMove({ ...state, status: state.status.clone() }, noCost);
      return [moved!];
    }

    return [
      ...dests
        .map((dest) => tryMove({ ...state, status: state.status.clone() }, dest))
        .filter((state) => state != null),
      ...conversions(state),
    ];
  },

  compareStatus(s: State, t: State): "=" | ">" | "<" | "<>" {
    if (equals(s, t)) return "=";
    if (superior(s, t)) return ">";
    if (superior(t, s)) return "<";
    return "<>";
  },
};

function reachables(state: State, graph: Graph): ObjectInstance[] {
  const visited = new Set<ObjectId>();
  const reached: ObjectInstance[] = [];
  const stack: ObjectId[] = [state.objectId];

  while (stack.length > 0) {
    const id = stack.pop()!;
    if (visited.has(id)) {
      continue;
    }

    visited.add(id);

    for (const to of graph.get(id)!) {
      if (visited.has(to.id)) {
        continue;
      }
      if (ObjectIds.has(state.erased, to.id)) {
        stack.push(to.id);
      } else {
        reached.push(to);
      }
    }
  }

  return reached;
}

function tryMove(state: State, dest: ObjectInstance): State | void {
  switch (dest.type) {
    case "up":
      state.status[dest.kind] += dest.amount;
      state.objectId = dest.id;
      state.erased = ObjectIds.add(state.erased, dest.id);
      return state;
    case "gate":
      if (dest.kind === "gold" && state.status.gold === 0) return;
      if (dest.kind === "silver" && state.status.silver === 0) return;
      if (dest.kind === "blue" && state.status.blue === 0) return;
      state.status[dest.kind] -= 1;
      state.objectId = dest.id;
      state.erased = ObjectIds.add(state.erased, dest.id);
      return state;
    case "enemy":
      const dmg = Battle.damage(state.status, dest);
      if (dmg == null) return;
      if (dmg >= state.status.hp) return;
      state.status.hp -= dmg;
      state.status.mag += 1;
      state.objectId = dest.id;
      state.erased = ObjectIds.add(state.erased, dest.id);
      return state;
    case "goal":
      state.objectId = dest.id;
      state.erased = ObjectIds.add(state.erased, dest.id);
      return state;
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

function equals(s: State, t: State): boolean {
  return s.status.equals(t.status);
}

function superior(s: State, t: State): boolean {
  return (
    s.status.notInferiorAllTo(t.status) &&
    s.status.superiorAnyTo(t.status)
  );
}
