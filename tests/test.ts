import { assertEquals } from "./deps.ts"

const dec = new TextDecoder();

// TODO loop over all .json files and run std testing framework.
const t = "test_simple.json";

const p = Deno.run({
  args: ["deno", "-A", "./serve.ts", t],
  stdout: "piped"
});
const out = dec.decode(await p.output());
// console.log(out)

const results = out.trim().split("\n").map(x => JSON.parse(x));
const expected = JSON.parse(dec.decode(await Deno.readFile(t)))["expected"];

assertEquals(results.length, expected.length)
for (const [i, r] of results.entries()) {
  assertEquals(r["status"], expected[i]["status"]);
  assertEquals(r["content"], expected[i]["content"]);
}
