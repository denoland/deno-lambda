import { Context, Event } from "./mod.ts";

export async function handler(event: Event, context: Context) {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
