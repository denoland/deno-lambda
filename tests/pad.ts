// pad.ts is chosen since it has no dependencies.
// i.e. we must download precisely one file from deno.land.
import { pad } from "https://deno.land/std/strings/pad.ts";

export function handler(event, context) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}

export async function assertLock(event, context) {
  // assert --lock was passed
  // Note: This is a file with external imports in order for -lock to be used.
  // FIXME remove this env hack and pull out the actual cli args from Deno itself.
  // (we shouldn't need to set DENO_FLAGS for deno in bootstrap.)
  const flags: string = Deno.env("DENO_FLAGS")!;
  if (/--lock=lock\.json/.test(flags)) {
    return {};
  }
  throw new Error("--lock=lock.json not passed to deno run " + flags);
}
