import { serve } from "./deps.ts";

// pass a json file
const testFilename = Deno.args[1];

const encode = new TextEncoder().encode;
const decode = new TextDecoder();

function* eventsGen() {
  const contents = decode.decode(Deno.readFileSync(testFilename));
  const events = JSON.parse(contents)["events"]
  for (const e of events) {
    yield e;
  }
}

const PORT = 1993;
const s = serve(`0.0.0.0:${PORT}`);

const statusOK = encode('{"status":"OK"}\n');

const p = Deno.run({
  args: ["docker", "run", "-t", "bootstrap"],
  stdout: "piped"
});

let events = eventsGen();

for await (const req of s) {
  let reqId = 1;
  if (req.method == "POST") {
    const body = decode.decode(await req.body());
    if (req.url.endsWith("/response")) {
      console.log(JSON.stringify({ status: "ok", content: body }));
    } else if (req.url.endsWith(`${reqId}/error`)) {
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
