import type {
  APIGatewayProxyEventV2,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

export function error(_event: APIGatewayProxyEventV2, _context: Context) {
  throw new MyError("error thrown");
}

// deno-lint-ignore no-explicit-any
export function foo(event: any, _context: Context) {
  // is there a foo attribute?! who knows!
  return event.foo || "a string";
}

export function withContext(
  _event: APIGatewayProxyEventV2,
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
let LOGGED: unknown[] = [];
const _log = console.log;
console.log = (...args) => {
  LOGGED.push(args);
  _log(args);
};

// deno-lint-ignore no-explicit-any
export function log(event: any, _context: Context) {
  LOGGED = [];
  // pretty print with newlines
  const message = JSON.stringify({ message: event.hello }, null, 2);
  console.log(message);
  console.warn("i warned you");
  console.error("uh oh");
  return {
    log: LOGGED.map((v) => {
      if ((v as string[]).length !== 1) {
        throw new Error("expected only one string passed to console.log");
      }
      return (v as string)[0].replace(/[0-9]/g, "0");
    }),
  };
}

// deno-lint-ignore no-explicit-any
export function badPrefix(event: any, _context: Context) {
  // assert warning message on init:
  console.log(event.hello);
  const log = LOGGED.map((args) => {
    // @ts-ignore  // to use Deno.internal
    return Deno[Deno.internal].inspectArgs(args);
  });
  LOGGED = [];
  return { log: log };
}

export function noArgs() {
  return {};
}

export async function runDeno(
  _event: APIGatewayProxyEventV2,
  _context: Context,
) {
  const r = Deno.run({ cmd: ["deno", "--version"], stdout: "piped" });
  const out = await r.output();
  const version = new TextDecoder().decode(out).split("\n")[0].split(" ")[1];
  return { out: version };
}

export function wrongArgs(a: number, b: number, c: number) {
  return { result: a * b * c };
}

export function xray(_event: APIGatewayProxyEventV2, _context: Context) {
  return { _X_AMZN_TRACE_ID: Deno.env.get("_X_AMZN_TRACE_ID") };
}
