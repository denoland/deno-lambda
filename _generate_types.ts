import { assert } from "https://deno.land/std@0.93.0/testing/asserts.ts";

const unpkg = "https://unpkg.com/@types/aws-lambda@8.10.76/";

// Get the index file
const indexReq = await fetch(`${unpkg}index.d.ts`);
assert(indexReq.ok);
const indexFile = await indexReq.text();

// Extract all imported files from this file
const imports = [...indexFile.matchAll(/\nexport \* from \"(.*)\";/g)].map((
  match,
) => match[1].replace(/^\.\//, unpkg).replace(/\/$/, "/index") + ".d.ts");

let typesFile = (indexFile.split("3.0")[0] + "3.0\n\n");

const files = await Promise.all(imports.map(async (url) => {
  const req = await fetch(url);
  assert(req.ok, "failed to fetch " + url);
  return req.text();
}));

for (const file of files) {
  typesFile += file;
}

typesFile = typesFile.replaceAll(
  /\nimport {(.|\n)*?} from ["'](.*?)["'];?/g,
  "",
);

typesFile = typesFile.replace("    callback: Callback<TResult>,\n", "");
typesFile = typesFile.replace("void | Promise<TResult>", "Promise<TResult>");

typesFile = typesFile.replace(
  /\n\/\*\*\n \* NodeJS-style(.|\n)*?\nexport type Callback(.|\n)*?;/,
  "",
);

typesFile = typesFile.replaceAll(
  /\nexport type (.*?) =[\n ]*Callback<(.*?)>;/g,
  "",
);
typesFile = typesFile.replaceAll(
  /\nexport type (.*?)Callback = .*?;/g,
  "",
);

typesFile = typesFile.replaceAll(
  /\n\n\/\/(.*?)\n\n/g,
  "\n\n",
);

typesFile = "// deno-lint-ignore-file\n" + typesFile;

Deno.writeTextFileSync("./runtime/types.d.ts", typesFile);

// This file generates mod.ts from types.d.ts
const types = [...typesFile.matchAll(/export (type|interface) (.*?)\s/g)].map((
  match,
) => match[2].replaceAll(/<(.*)$/g, "")).filter((t) => !t.includes("Callback"))
  .sort();

Deno.writeTextFileSync(
  "./runtime/mod.ts",
  `export type {\n  ${types.join(",\n  ")}\n } from \"./types.d.ts\";\n`,
);

await Deno.run({ cmd: ["deno", "fmt", "runtime/mod.ts", "runtime/types.d.ts"] }).status();
