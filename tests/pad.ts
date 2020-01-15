// pad.ts is chosen since it has no dependencies.
// i.e. we must download precisely one file from deno.land.
import { pad } from "https://deno.land/std/strings/pad.ts";

export function handler(event, context) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}

export async function assertLock(event, context) {
  // assert --lock was passed
  // FIXME remove this env hack and pull out the actual cli args from Deno itself.
  // (we don't necessary need to set DENO_FLAGS for deno in bootstrap.)
  if (Deno.env("DENO_FLAGS").includes("--lock=lock.json")) {
    return {};
  }
  throw new Error("--lock not passed to deno run");
}
