import { pad } from "std/strings/pad.ts";

export function handler(event, context) {
  const strLen: number = Number(event.strLen) || 5;
  return pad("deno", strLen);
}
