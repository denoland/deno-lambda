import { Context, APIGatewayProxyEvent } from "https://deno.land/x/lambda/mod.ts";

class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = "MyError";
  }
}

export async function error(event: APIGatewayProxyEvent, context: Context) {
  throw new MyError("error thrown");
}

export async function foo(event, context) {
  // is there a foo attribute?! who knows!
  return event.foo || "a string";
}

export async function withContext(event: APIGatewayProxyEvent, context: Context) {
  return { name: context.functionName, awsRequestId: context.awsRequestId };
}

// TODO add a test for this behavior.
export async function log(event, context) {
  const message = event.hello;
  console.log(message);
  return { message };
}

export async function noArgs() {
  return {};
}

export async function wrongArgs(a: number, b: number, c: number) {
  return { result: a * b * c };
}
