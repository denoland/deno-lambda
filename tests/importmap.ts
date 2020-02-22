import {
  APIGatewayProxyEvent,
  Context
} from "https://deno.land/x/lambda/mod.ts";
import { pad } from "std/strings/pad.ts";

export function handler(event: any, context: Context) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}
