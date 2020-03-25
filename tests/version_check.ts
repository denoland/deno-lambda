import { assertEquals } from "./deps.ts";

Deno.test(function versionCheck() {
  const v = Deno.env("DENO_LAMBDA_VERSION");
  if (v !== undefined) {
    assertEquals(v, Deno.version.deno);
  }
});
