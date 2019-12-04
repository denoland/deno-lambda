import { Context, Event } from "https://deno.land/x/lambda/mod.ts";
import { pad } from "https://deno.land/std/strings/pad.ts";

export function handler(event: Event, context: Context) {
  return pad("deno", 5);
}
