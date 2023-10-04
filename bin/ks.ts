import { run } from "../lib/mod.ts";
import * as Config from "./internal/config.ts";

if (import.meta.main) {
  const config = Config.create(Deno.args);
  if (Error.isError(config)) {
    console.error(config.message);
    Deno.exit(1);
  }

  const json = run(config);
  if (json != null) {
    console.log(json);
  }
}
