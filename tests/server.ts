import { serve } from "./deps.ts";

const encode = new TextEncoder().encode;
const decode = new TextDecoder();

const testFilename = Deno.args[1];
const test = JSON.parse(decode.decode(Deno.readFileSync(testFilename)));

function* eventsGen() {
  for (const e of test["events"]) {
    yield e;
  }
}

const env = test.env || {};

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);

const statusOK = encode('{"status":"OK"}\n');

const bootstrap = Deno.readDirSync("/var/task/")
  .map(x => x.name)
  .includes("bootstrap")
  ? "/var/task/bootstrap"
  : "/opt/bootstrap";

const p = Deno.run({
  args: [bootstrap],
  stdout: "piped",
  stderr: "piped", // comment this out to debug
  env,
  cwd: "/var/task"
});

const events = eventsGen();

let reqId = 0;
for await (const req of s) {
  if (req.method == "POST") {
    if (req.url.endsWith("/response")) {
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "ok", content: body }));
    } else if (req.url.endsWith("/init/error")) {
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
      await req.respond({ body: statusOK });
      p.kill(9);
      s.close();
      Deno.exit();
    } else if (req.url.endsWith(`/${reqId}/error`)) {
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
    } else {
      throw new Error("Unreachable!")
    }
    // raise on other?
    await req.respond({ body: statusOK });
  } else {
    // assert endsWith /next
    const e = events.next();
    if (e.done) {
      p.kill(9);
      s.close();
      Deno.exit();
    } else {
      reqId++;
      const headers = new Headers({
        'lambda-runtime-invoked-function-arn': "arn:aws:lambda:us-east-1:776893852117:function:test",
        'lambda-runtime-aws-request-id': reqId.toString(),
        'lambda-runtime-deadline-ms': (Date.now() + 300000).toString()
      })
      await req.respond({ body: encode(JSON.stringify(e.value)), headers });
    }
  }
}
