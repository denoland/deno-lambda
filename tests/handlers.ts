import {
  Context,
  APIGatewayProxyEvent
} from "https://deno.land/x/lambda/mod.ts";

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

export async function withContext(
  event: APIGatewayProxyEvent,
  context: Context
) {
  return {
    name: context.functionName,
    awsRequestId: context.awsRequestId,
    clientContext: context.clientContext,
    identity: context.identity
  };
}

// Note: This is evaluated prior to the redefinition of console.log in bootstrap.
// This is a devious trick to catch the output of console.log and friends.
let LOGGED = [];
const _log = console.log;
console.log = (...args) => {
  LOGGED.push(args);
  _log(args);
}
export async function log(event, context) {
  LOGGED = [];
  const message = event.hello;
  console.log(message);
  console.warn("i warned you");
  console.error("uh oh");
  return { log: LOGGED };
}

export async function noArgs() {
  return {};
}

export async function runDeno(event, context) {
  const r = Deno.run({ args: ["deno", "--version"], stdout: "piped" });
  const out = await r.output()
  const version = new TextDecoder().decode(out).split('\n')[0];
  return { out: version };
}

export async function wrongArgs(a: number, b: number, c: number) {
  return { result: a * b * c };
}

export async function xray(event, context) {
  return { "_X_AMZN_TRACE_ID": Deno.env("_X_AMZN_TRACE_ID") }
}
