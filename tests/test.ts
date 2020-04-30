import { assertEquals } from "./deps.ts";
import { TestJson, serveEvents } from "./server.ts";

const dec = new TextDecoder();

const testFiles = [...Deno.readDirSync("/src/tests")]
  .map((f) => f.name || "ignore")
  .filter((x) => x.startsWith("test_"))
  .filter((x) => x.endsWith(".json"))
  .map((x) => x.split("/").slice(-1)[0])
  .sort();

if (!Deno.env.get("_IN_DOCKER")) {
  console.error("test.ts must be called inside a docker container");
  Deno.exit(1);
}

async function addFiles(
  zipOrFiles: string | Array<string> | undefined,
  toDir: string,
): Promise<void> {
  if (!zipOrFiles) {
    return;
  }
  if (typeof zipOrFiles == "string") {
    const zipFile = zipOrFiles;
    // TODO check it raises on errors?
    const p = Deno.run({
      cmd: ["unzip", "-qq", `/src/runtime/${zipFile}`, "-d", toDir],
    });
    await p.status();
    p.close();
  } else {
    await Deno.mkdir(toDir + "/bin");
    const files = zipOrFiles;
    for await (const f of files) {
      await Deno.copyFile(`/src/tests/${f}`, `${toDir}/${f}`);
    }
  }
}

async function emptyDir(dir: string) {
  for (const f of Deno.readDirSync(dir)) {
    await Deno.remove(`${dir}/${f.name}`, { recursive: true });
  }
}

for (const t of testFiles) {
  const testName = t.slice(0, -5);
  Deno.test({
    name: testName,
    fn: async () => {
      const testPath = `/src/tests/${t}`;
      const testJson: TestJson = JSON.parse(
        dec.decode(await Deno.readFile(testPath)),
      );

      // This is the layer
      await emptyDir("/opt");
      await addFiles(testJson["layer"], "/opt");

      // This is the function code
      await emptyDir("/var/task");
      await addFiles(testJson["files"], "/var/task");

      const out = await serveEvents(testJson);
      const responses = out.responses.map((x) => JSON.parse(x));
      const expected = testJson["expected"];

      assertEquals(expected, responses);
      // console.log(out.out)  // FIXME this is always empty
    },
  });
}
