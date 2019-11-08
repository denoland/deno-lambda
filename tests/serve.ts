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

const env = test.env || [];

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);

const statusOK = encode('{"status":"OK"}\n');

const p = Deno.run({
  args: ["./bootstrap"],
  stdout: "piped",
  stderr: "piped",  // comment this out to debug
  env
});

const events = eventsGen();

let reqId = 1;
for await (const req of s) {
  if (req.method == "POST") {
    if (req.url.endsWith("/response")) {
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "ok", content: body }));
    } else if (req.url.endsWith("/init/error")) {
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
      p.kill(9);
      s.close();
      break;
    } else if (req.url.endsWith("/null/error")) {
      // req.url.endsWith(`${reqId}/error`
      const body = decode.decode(await req.body());
      console.log(JSON.stringify({ status: "error", content: body }));
    }
    // handle initError
    // raise on other?
    await req.respond({ body: statusOK });
  } else {
    // assert endsWith /next
    const e = events.next();
    reqId++;
    if (e.done) {
      p.kill(9);
      s.close();
      break;
    } else {
      await req.respond({ body: encode(JSON.stringify(e.value)) });
    }
  }
}

Deno.exit();

// headers (are these case insensitive?)
// 'Lambda-Runtime-Aws-Request-Id'
// 'lambda-runtime-invoked-function-arn'
// 'lambda-runtime-aws-request-id'
// 'lambda-runtime-deadline-ms'
