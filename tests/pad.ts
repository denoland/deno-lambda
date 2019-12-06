import { Context, Event } from "https://deno.land/x/lambda/mod.ts";
// pad.ts is chosen since it has no dependencies.
// i.e. we must download precisely one file from deno.land.
import { pad } from "https://deno.land/std/strings/pad.ts";

export function handler(event: Event, context: Context) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}
