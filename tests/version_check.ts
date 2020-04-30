import { assertEquals } from "./deps.ts";

Deno.test("versionCheck", () => {
  const v = Deno.env.get("DENO_LAMBDA_VERSION");
  assertEquals(v, Deno.version.deno);
});
