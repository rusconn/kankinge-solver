import type { Graph } from "./graph.ts";
import * as Object from "./object.ts";
import { ObjectIds } from "./object-ids.ts";
import type { ObjectId, ObjectInstance } from "./object-map.ts";
import * as Battle from "./state/battle.ts";
import { Status } from "./state/status.ts";

export type State = {
  objectId: ObjectId;
  status: Status;
  erased: ObjectIds;
};

export function initial(objectId: ObjectId): State {
  return {
    objectId,
    status: Status.initial(),
    erased: ObjectIds.empty(),
  };
}

export function expand(state: State, graph: Graph): State[] {
  const noCost = moveToNoCost(state, graph);
  if (noCost) return [noCost];

  return [
    ...moves(state, graph),
    ...conversions(state),
  ];
}

export function moveToNoCost(state: State, graph: Graph): State | void {
  const noCostEdge = graph.get(state.objectId)!.values()
    .find((edge) => {
      if (state.erased.has(edge.to.id)) return;
      if (!state.erased.isSupersetOf(edge.blockers)) return;
      return Object.isUp(edge.to) ||
        (Object.isEnemy(edge.to) && Battle.isNoDmg(state.status, edge.to));
    });
  if (noCostEdge) {
    return tryMove({
      ...state,
      status: state.status.clone(), // なんでcloneが必要？
    }, noCostEdge.to)!;
  }
}

function moves(state: State, graph: Graph): State[] {
  return (
    graph.get(state.objectId)!.values()
      .filter((edge) =>
        !state.erased.has(edge.to.id) &&
        state.erased.isSupersetOf(edge.blockers)
      )
      .map((edge) =>
        tryMove({
          ...state,
          status: state.status.clone(),
          erased: state.erased.clone(),
        }, edge.to)
      )
      .filter((state) => state != null)
      .toArray()
  );
}

function tryMove(state: State, dest: ObjectInstance): State | void {
  state.objectId = dest.id;
  state.erased.add(dest.id);

  switch (dest.type) {
    case "up":
      state.status[dest.kind] += dest.amount;
      return state;
    case "gate":
      if (dest.kind === "gold" && state.status.gold === 0) return;
      if (dest.kind === "silver" && state.status.silver === 0) return;
      if (dest.kind === "blue" && state.status.blue === 0) return;
      state.status[dest.kind] -= 1;
      return state;
    case "enemy":
      const dmg = Battle.damage(state.status, dest);
      if (dmg == null) return;
      if (dmg >= state.status.hp) return;
      state.status.hp -= dmg;
      state.status.mag += 1;
      return state;
    case "goal":
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

export function compareStatus(s: State, t: State): "=" | ">" | "<" | "<>" {
  if (equals(s, t)) return "=";
  if (dominates(s, t)) return ">";
  if (dominates(t, s)) return "<";
  return "<>";
}

function equals(s: State, t: State): boolean {
  return s.status.equals(t.status);
}

function dominates(s: State, t: State): boolean {
  return (
    s.status.notInferiorAllTo(t.status) &&
    s.status.superiorAnyTo(t.status)
  );
}
