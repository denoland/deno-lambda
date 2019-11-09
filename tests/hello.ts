import { Context, Event } from "https://deno.land/x/lambda/mod.ts";

export async function handler(event: Event, context: Context) {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
