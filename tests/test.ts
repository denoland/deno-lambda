import { assertEquals, runIfMain, test } from "./deps.ts";
import { serveEvents } from "./server.ts";

const dec = new TextDecoder();

const testFiles = Deno.readDirSync("/src/tests")
  .map(f => f.name)
  .filter(x => x.startsWith("test_"))
  .filter(x => x.endsWith(".json"))
  .map(x => x.split("/").slice(-1)[0])
  .sort();

if (!Deno.env("_IN_DOCKER")) {
  console.error("test.ts must be called inside a docker container");
  Deno.exit(1);
}

async function addFiles(
  zipOrFiles: string | Array<string>,
  toDir: string
): Promise<void> {
  if (!zipOrFiles) {
    return;
  }
  if (typeof zipOrFiles == "string") {
    const zipFile = zipOrFiles;
    // TODO check it raises on errors?
    await Deno.run({
      args: ["unzip", "-qq", `/src/runtime/${zipFile}`, "-d", toDir]
    }).status();
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
  test({
    name: testName,
    fn: async () => {
      const testPath = `/src/tests/${t}`;
      const testJson = JSON.parse(dec.decode(await Deno.readFile(testPath)));

      // This is the layer
      await emptyDir("/opt");
      await addFiles(testJson["layer"], "/opt");

      // This is the function code
      await emptyDir("/var/task");
      await addFiles(testJson["files"], "/var/task");

      const ret = await serveEvents(testJson);
      const responses = ret.responses.map(x => JSON.parse(x));
      const expected = testJson["expected"];
      const out = dec.decode(ret.out);
      const expectedOut = testJson["out"] || "";

      assertEquals(expected, responses);
      // TODO removed console.log hacks
      // assertEquals(expectedOut, out);
    }
  });
}

await runIfMain(import.meta);
// we have to explicitly kill awaits where stdout was empty...
// FIXME create/reference a deno issue (of awaiting empty stdout).
// Note: We're working around this block too:
// https://github.com/denoland/deno/blob/a3bfbcceade3d359f677106399562b461b4af01a/cli/js/testing.ts#L196-L205
setTimeout((): void => {
  Deno.exit(0);
}, 0);
