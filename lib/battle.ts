import type { Enemy, Player } from "./object.ts";

export function isNoDmg(player: Player, enemy: Enemy): boolean {
  return damage(player, enemy) === 0;
}

export function damage(player: Player, enemy: Enemy): number | void {
  const dpt = Math.max(player.atk - enemy.def, 0);
  const edpt = Math.max(enemy.atk - player.def, 0);

  if (dpt === 0) return;

  const turn = Math.ceil(enemy.hp / dpt);
  const dmgCount = turn - 1;

  return edpt * dmgCount;
}
