import { serve } from "./deps.ts";

const encode = new TextEncoder().encode;
const dec = new TextDecoder();

const testJson = JSON.parse(dec.decode(Deno.readFileSync(Deno.args[1])));

// start the server prior to running bootstrap.
const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);

const bootstrap = Deno.readDirSync("/var/task/")
  .map(x => x.name)
  .includes("bootstrap")
  ? "/var/task/bootstrap"
  : "/opt/bootstrap";

const p = Deno.run({
  args: [bootstrap],
  stdout: "piped",
  stderr: "piped", // comment this out to debug
  env: testJson.env,
  cwd: "/var/task"
});

const statusOK = encode('{"status":"OK"}\n');

const events = testJson["events"][Symbol.iterator]();
// iterate through the events until done.
let reqId = 0;
for await (const req of s) {
  if (req.method == "POST") {
    if (req.url.endsWith("/response")) {
      const body = dec.decode(await req.body());
      console.log(JSON.stringify({ status: "ok", content: body }));
    } else if (req.url.endsWith("/init/error")) {
      const body = dec.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
      await req.respond({ body: statusOK });
      p.kill(9);
      s.close();
      Deno.exit();
    } else if (req.url.endsWith(`/${reqId}/error`)) {
      const body = dec.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
    } else {
      throw new Error("Unreachable!");
    }
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
        "lambda-runtime-invoked-function-arn":
          "arn:aws:lambda:us-east-1:776893852117:function:test",
        "lambda-runtime-aws-request-id": reqId.toString(),
        "lambda-runtime-deadline-ms": (Date.now() + 300000).toString()
      });
      await req.respond({ body: encode(JSON.stringify(e.value)), headers });
    }
  }
}
