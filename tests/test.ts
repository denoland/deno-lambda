import { assertEquals, runIfMain, test } from "./deps.ts";

const dec = new TextDecoder();

const testFiles = Deno.readDirSync("/src/tests")
  .map(f => f.name)
  .filter(x => x.startsWith("test_"))
  .filter(x => x.endsWith(".json"))
  .map(x => x.split("/").slice(-1)[0]);
//const testFiles = ["test_self_contained.json"];

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
    const files = zipOrFiles;
    for await (const f of files) {
      await Deno.copyFile(`/src/tests/${f}`, `${toDir}/${f}`);
    }
  }
}

async function clearDir(dir: string) {
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
      await clearDir("/opt");
      await addFiles(testJson["layer"], "/opt");

      // This is the function code
      await clearDir("/var/task");
      await addFiles(testJson["files"], "/var/task");

      const p = Deno.run({
        args: ["deno", "-A", "/src/tests/server.ts", testPath],
        stdout: "piped",
        // stderr: "piped",
        cwd: "/var/task"
      });
      const out = dec.decode(await p.output());

      const results = out
        .trim()
        .split("\n")
        .map(x => JSON.parse(x));
      const expected = testJson["expected"];

      assertEquals(expected, results);
    }
  });
}

runIfMain(import.meta);
