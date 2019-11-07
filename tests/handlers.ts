import { Context, Event } from "./mod.ts";

class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = "MyError";
  }
}

export async function error(event: Event, context: Context) {
  throw new MyError("error thrown");
}
