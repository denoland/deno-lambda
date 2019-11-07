import { Context, Event } from "./mod.ts";
import { Lambda } from "./runtime.ts";

let env;

function onLambda(): boolean {
  return !!env && !!env.AWS_LAMBDA_FUNCTION_NAME;
}

async function initError(message: string): Promise<void> {
  console.error("error:", message);
  if (onLambda()) {
    const API_ROOT = `http://${env.AWS_LAMBDA_RUNTIME_API}/2018-06-01/runtime/`;
    const INIT_ERROR = `${API_ROOT}init/error`;
    const body = {
      errorMessage: JSON.stringify(message),
      errorType: "InitException"
    };
    // do we need to set header "Lambda-Runtime-Function-Error-Type: Unhandled" ?
    const res = await fetch(INIT_ERROR, {
      method: "POST",
      body: JSON.stringify(body)
    });
    await res.blob();
  }
  Deno.exit(1);
}

// TODO(hayd): decide whether this be explicitly called.
// The invocation loop is called whenever imported
// we sniff to see if we're running on Lambda or running locally...
export async function bootstrap(lambda: Lambda) {
  const handler = lambda.handler;

  try {
    env = Deno.env();
  } catch (_) {
    // Hopefully this means you aren't onLambda.
    // The runtime *requires* --allow-env.
  }
  if (handler === undefined) {
    return await initError("lambda.handler must be set");
  }

  // only run the invocation loop on lambda.
  // should this console.warn?
  if (!onLambda()) {
    return;
  }

  const API_ROOT = `http://${env.AWS_LAMBDA_RUNTIME_API}/2018-06-01/runtime/`;
  const INVOCATION = `${API_ROOT}invocation/`;

  while (true) {
    const next = await fetch(INVOCATION + "next");
    const headers = next.headers;
    const reqId = headers.get("Lambda-Runtime-Aws-Request-Id");
    const context: Context = {
      functionName: env.AWS_LAMBDA_FUNCTION_NAME,
      functionVersion: env.AWS_LAMBDA_FUNCTION_VERSION,
      invokedFunctionArn: headers.get("lambda-runtime-invoked-function-arn"),
      memoryLimitInMB: env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
      awsRequestId: headers.get("lambda-runtime-aws-request-id"),
      logGroupName: env.AWS_LAMBDA_LOG_GROUP_NAME,
      logStreamName: env.AWS_LAMBDA_LOG_STREAM_NAME,
      identity: undefined,
      clientContext: undefined,
      getRemainingTimeInMillis: function() {
        return Number(headers.get("lambda-runtime-deadline-ms")) - Date.now();
      }
    };
    let res;
    try {
      const event: Event = await next.json();
      const body = await handler(event, context);
      res = await fetch(INVOCATION + reqId + "/response", {
        method: "POST",
        body: JSON.stringify(body)
      });
    } catch (e) {
      console.error(e);
      // If it's an Error we can pull these out cleanly...
      // BUT it's javascript so it could be anything!
      // If there's a better way, very happy to take suggestions.
      let name, message;
      try {
        name = e.name || "Error";
      } catch (_) {
        name = "Error";
      }
      try {
        message = e.message || e;
      } catch (_) {
        message = e;
      }
      if (typeof name !== "string") {
        name = JSON.stringify(name);
      }
      if (typeof message !== "string") {
        const s = JSON.stringify(message);
        message = s === undefined ? "" + message : s;
      }
      res = await fetch(INVOCATION + reqId + "/error", {
        method: "POST",
        body: JSON.stringify({
          errorMessage: message,
          errorType: name
        })
      });
    }
    await res.blob();
  }
}
