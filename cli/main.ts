import { solve, Stage } from "../core/mod.ts";
import { Config } from "./config.ts";

if (import.meta.main) {
  const config = Config.create(Deno.args);
  if (Error.isError(config)) {
    console.error(config.message);
    Deno.exit(1);
  }

  const stageJson = Deno.readTextFileSync(config.stagePath);
  const stage = Stage.parse(stageJson);
  const solution = solve(stage, config.algorithm);

  console.log(JSON.stringify(solution ?? "impossible"));
}
