import type { Config } from "./config.ts";
import * as iddfs from "./strategies/iddfs.ts";

export type { Config };

export function run(config: Config): string | void {
  return iddfs.run(config);
}
