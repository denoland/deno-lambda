// delay.ts was chosen since it has no dependencies.
// i.e. importing downloads precisely one file from deno.land.
import { delay } from "https://deno.land/std@0.93.0/async/delay.ts";

export async function handler(_event: unknown, _context: unknown) {
  await delay(10);
  return "deno";
}

// This is here as we want to require the file have a locked dependency.
export function assertLock(_event: unknown, _context: unknown) {
  // assert --lock was passed
  // FIXME remove this env hack and pull out the actual cli args from Deno itself.
  // (we shouldn't need to set DENO_FLAGS for deno in bootstrap.)
  const flags: string = Deno.env.get("DENO_FLAGS")!;
  if (/--lock=lock\.json/.test(flags)) {
    return {};
  }
  throw new Error("--lock=lock.json not passed to deno run " + flags);
}
