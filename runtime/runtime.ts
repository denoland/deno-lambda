// This is optional.
// If you use a file + exported handler this is not needed.
// If you bundle your code (for now) you need to:
// 1. import `lambda`.
// 2. set `lambda.handler`.
import { Context, Event } from "./mod.ts";
import { bootstrap } from "./bootstrap.ts";

export interface Lambda {
  handler: (event: Event, context: Context) => any;
}

export const lambda: Lambda = { handler: undefined };

window.onload = async () => {
  await bootstrap(lambda);
};
