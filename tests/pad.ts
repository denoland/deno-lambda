// pad.ts was chosen since it has no dependencies.
// i.e. we must download precisely one file from deno.land.
// FIXME: it has since been removed from std so this should be refactored.
// (see also importmap.ts)
import { pad } from "https://deno.land/std@v0.38.0/strings/pad.ts";

export function handler(event: any, context: any) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}

// FIXME why is this function in pad.ts?
export async function assertLock(event: any, context: any) {
  // assert --lock was passed
  // Note: This is a file with external imports in order for -lock to be used.
  // FIXME remove this env hack and pull out the actual cli args from Deno itself.
  // (we shouldn't need to set DENO_FLAGS for deno in bootstrap.)
  const flags: string = Deno.env.get("DENO_FLAGS")!;
  if (/--lock=lock\.json/.test(flags)) {
    return {};
  }
  throw new Error("--lock=lock.json not passed to deno run " + flags);
}
