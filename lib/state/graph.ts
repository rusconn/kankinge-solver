import * as Object from "../object.ts";
import type { Player } from "../object.ts";
import * as ObjectMap from "./object-map.ts";
import type { ObjectInstance } from "./object-map.ts";
import * as Edges from "./edges.ts";

type ObjectMap = ObjectMap.ObjectMap;
type Edges = Edges.Edges;

export type Graph = Map<ObjectInstance, Edges>;

export type PlayerState = {
  edges: Edges;
  obj: Player;
};

export function create(mapPath: string): { player: PlayerState; graph: Graph } {
  const objects = ObjectMap.create(mapPath);

  const graph = new Map();

  let playerEdges = null;
  let playerObj = null;

  for (const row of objects.values()) {
    for (const obj of row.values()) {
      if (!Object.isWall(obj) && !Object.isRoad(obj)) {
        const edges = Edges.create(objects, obj.point);

        if (Object.isPlayer(obj)) {
          playerEdges = edges;
          playerObj = obj;
        } else {
          graph.set(obj, edges);
        }
      }
    }
  }

  if (playerEdges == null || playerObj == null) {
    throw new Error("Something went wrong");
  }

  const player = {
    edges: playerEdges,
    obj: playerObj,
  };

  return { player, graph };
}
