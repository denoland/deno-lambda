import type {
  APIGatewayProxyEventV2,
  Context,
} from "https://deno.land/x/lambda/mod.ts";
import { delay } from "std/async/delay.ts";

export async function handler(
  _event: APIGatewayProxyEventV2,
  _context: Context,
) {
  await delay(10);
  return "deno";
}
