import { assertEquals, runIfMain, test } from "./deps.ts";

const dec = new TextDecoder();

const testFiles = Deno.readDirSync(".")
  .map(f => f.name)
  .filter(x => x.endsWith(".json"));

for (const t of testFiles) {
  const testName = t.slice(0, -5);
  test({
    name: testName,
    fn: async () => {
      const p = Deno.run({
        args: ["deno", "-A", "./server.ts", t],
        stdout: "piped"
        // stderr: "piped"
      });
      const out = dec.decode(await p.output());

      const results = out
        .trim()
        .split("\n")
        .map(x => JSON.parse(x));
      const expected = JSON.parse(dec.decode(await Deno.readFile(t)))[
        "expected"
      ];

      assertEquals(expected.length, results.length);
      for (const [i, r] of results.entries()) {
        assertEquals(expected[i]["status"], r["status"]);
        assertEquals(expected[i]["content"], r["content"]);
      }
    }
  });
}

runIfMain(import.meta);
