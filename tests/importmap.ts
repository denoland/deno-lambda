import type {
  APIGatewayProxyEvent,
  Context,
} from "https://deno.land/x/lambda/mod.ts";
import { delay } from "std/async/delay.ts";

export async function handler(event: unknown, context: Context) {
  await delay(10);
  return "deno";
}
