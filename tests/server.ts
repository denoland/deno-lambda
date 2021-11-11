import { assert, readAll, serve } from "./deps.ts";

const enc = new TextEncoder();
const dec = new TextDecoder();

const PORT = 1993;

export interface TestJson {
  layer?: string | string[];
  files: string | string[];
  expected?: string;
  env: Record<string, string>;
  headers?: Record<string, Record<string, string | Record<string, string>>>;
  events: string[];
}

function bootstrap(testJson: TestJson) {
  const bootstrapScript = [...Deno.readDirSync("/var/task/")]
      .map((x) => x.name)
      .includes("bootstrap")
    ? "/var/task/bootstrap"
    : "/opt/bootstrap";

  if (!testJson.env.DENO_DIR) {
    testJson.env.DENO_DIR = "";
  }
  return Deno.run({
    cmd: [bootstrapScript],
    stdout: "piped",
    // FIXME: uncommenting this no longer works cleanly (since .close is undefined on stderr)
    stderr: "piped", // comment this out to debug
    env: testJson.env,
    cwd: "/var/task",
  });
}

const statusOK = enc.encode('{"status":"OK"}\n');

export async function serveEvents(testJson: TestJson) {
  // start the server prior to running bootstrap.
  const addr = `0.0.0.0:${PORT}`;
  const abortController = new AbortController();

  const p = bootstrap(testJson);

  const events = testJson["events"][Symbol.iterator]();
  const responses: string[] = [];
  // iterate through the events until done.
  let reqId = 0;

  const handler = async (req: Request) => {
    if (req.method == "POST") {
      if (req.url.endsWith("/response")) {
        const body = req.text();
        responses.push(JSON.stringify({ status: "ok", content: body }));
      } else if (req.url.endsWith("/init/error")) {
        const body = req.text();
        responses.push(JSON.stringify({ status: "error", content: body }));
        return new Response(statusOK);
      } else if (
        req.url.endsWith(`/${String.fromCharCode(96 + reqId)}/error`)
      ) {
        const body = req.text();
        responses.push(JSON.stringify({ status: "error", content: body }));
      } else {
        throw new Error("Unreachable!");
      }
      return new Response(statusOK);
    } else {
      // assert endsWith /next
      const e = events.next();
      if (e.done) {
        // TODO signal?
        throw new Error("BREAK!");
      } else {
        reqId++;
        const headers = new Headers({
          "lambda-runtime-invoked-function-arn":
            "arn:aws:lambda:us-east-1:776893852117:function:test",
          // start at a.
          "lambda-runtime-aws-request-id": String.fromCharCode(96 + reqId),
          "lambda-runtime-deadline-ms": (Date.now() + 300000).toString(),
        });
        if (testJson.headers) {
          for (const [k, v] of Object.entries(testJson.headers)) {
            const vv = typeof v === "string" ? v : JSON.stringify(v);
            assert(typeof vv === "string");
            headers.append(k, vv);
          }
        }
        return new Response(enc.encode(JSON.stringify(e.value)), { headers });
      }
    }
  }
  await serve(handler, { addr, signal: abortController.signal } );
  /// const out = await readAll(p.stdout);
  p.kill("SIGKILL");
  p.stdout!.close();
  p.stderr!.close();
  abortController.abort();
  // s.close();
  await p.status();
  p.close();
  return {
    responses: responses,
  };
}
