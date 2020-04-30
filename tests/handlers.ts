import {
  Context,
  APIGatewayProxyEvent
} from "https://deno.land/x/lambda/mod.ts";

class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

export async function error(event: APIGatewayProxyEvent, context: Context) {
  throw new MyError("error thrown");
}

export async function foo(event: any, context: Context) {
  // is there a foo attribute?! who knows!
  return event.foo || "a string";
}

export async function withContext(
  event: APIGatewayProxyEvent,
  context: Context,
) {
  return {
    name: context.functionName,
    awsRequestId: context.awsRequestId,
    clientContext: context.clientContext,
    identity: context.identity,
  };
}

// Note: This is evaluated prior to the redefinition of console.log in bootstrap.
// This is a devious trick to catch the output of console.log and friends.
let LOGGED: any[] = [];
const _log = console.log;
console.log = (...args) => {
  LOGGED.push(args);
  _log(args);
};
export async function log(event: any, context: Context) {
  LOGGED = [];
  // pretty print with newlines
  const message = JSON.stringify({ message: event.hello }, null, 2);
  console.log(message);
  console.warn("i warned you");
  console.error("uh oh");
  return {
    log: LOGGED.map((v) => {
      if (v.length !== 1) {
        throw new Error("expected only one string passed to console.log");
      }
      return v[0].replace(/[0-9]/g, "0");
    }),
  };
}

export async function badPrefix(event: any, context: Context) {
  // assert warning message on init:
  console.log(event.hello);
  const log = LOGGED.map((args) => {
    // @ts-ignore
    return Deno[Deno.internal].stringifyArgs(args);
  });
  LOGGED = [];
  return { log: log };
}

export async function noArgs() {
  return {};
}

export async function runDeno(event: APIGatewayProxyEvent, context: Context) {
  const r = Deno.run({ cmd: ["deno", "--version"], stdout: "piped" });
  const out = await r.output();
  const version = new TextDecoder().decode(out).split("\n")[0];
  return { out: version };
}

export async function wrongArgs(a: number, b: number, c: number) {
  return { result: a * b * c };
}

export async function xray(event: APIGatewayProxyEvent, context: Context) {
  return { _X_AMZN_TRACE_ID: Deno.env.get("_X_AMZN_TRACE_ID") };
}
