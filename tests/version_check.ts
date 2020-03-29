import { assertEquals } from "./deps.ts";

Deno.test(function versionCheck() {
  const v = Deno.env("DENO_LAMBDA_VERSION");
  assertEquals(v, Deno.version.deno);
});
