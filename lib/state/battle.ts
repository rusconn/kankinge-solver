import type { Enemy } from "../object.ts";
import type { Status } from "./status.ts";

export function isNoDmg(player: Status, enemy: Enemy): boolean {
  return damage(player, enemy) === 0;
}

export function damage(player: Status, enemy: Enemy): number | void {
  const dpt = Math.max(player.atk - enemy.def, 0);
  const edpt = Math.max(enemy.atk - player.def, 0);

  if (dpt === 0) return;

  const turn = Math.ceil(enemy.hp / dpt);
  const dmgCount = turn - 1;

  return edpt * dmgCount;
}
