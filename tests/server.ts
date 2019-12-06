import { serve } from "./deps.ts";

const encode = new TextEncoder().encode;
const dec = new TextDecoder();

const PORT = 1993;

function bootstrap(testJson) {
  const bootstrapScript = Deno.readDirSync("/var/task/")
    .map(x => x.name)
    .includes("bootstrap")
    ? "/var/task/bootstrap"
    : "/opt/bootstrap";

  if (!testJson.env.DENO_DIR) {
    testJson.env.DENO_DIR = "";
  }
  return Deno.run({
    args: [bootstrapScript],
    stdout: "piped",
    stderr: "piped", // comment this out to debug
    env: testJson.env,
    cwd: "/var/task"
  });
}

// is this in cli/std? r: ReadCloser
async function read(r) {
  const buf = new Uint8Array(10000);
  const n = await r.read(buf);
  return dec.decode(buf.slice(n));
}

const statusOK = encode('{"status":"OK"}\n');

export async function serveEvents(testJson) {
  // start the server prior to running bootstrap.
  const s = serve(`0.0.0.0:${PORT}`);
  const p = bootstrap(testJson);

  const events = testJson["events"][Symbol.iterator]();
  const responses = [];
  // iterate through the events until done.
  let reqId = 0;
  for await (const req of s) {
    if (req.method == "POST") {
      if (req.url.endsWith("/response")) {
        const body = dec.decode(await req.body());
        responses.push(JSON.stringify({ status: "ok", content: body }));
      } else if (req.url.endsWith("/init/error")) {
        const body = dec.decode(await req.body());
        responses.push(JSON.stringify({ status: "error", content: body }));
        await req.respond({ body: statusOK });
        break;
      } else if (req.url.endsWith(`/${reqId}/error`)) {
        const body = dec.decode(await req.body());
        responses.push(JSON.stringify({ status: "error", content: body }));
      } else {
        throw new Error("Unreachable!");
      }
      await req.respond({ body: statusOK });
    } else {
      // assert endsWith /next
      const e = events.next();
      if (e.done) {
        break;
      } else {
        reqId++;
        const headers = new Headers({
          "lambda-runtime-invoked-function-arn":
            "arn:aws:lambda:us-east-1:776893852117:function:test",
          "lambda-runtime-aws-request-id": reqId.toString(),
          "lambda-runtime-deadline-ms": (Date.now() + 300000).toString()
        });
        await req.respond({ body: encode(JSON.stringify(e.value)), headers });
      }
    }
  }
  /// const out = await read(p.stdout);
  p.kill(9);
  s.close();
  await p.status();
  return {
    responses: responses
  };
}
