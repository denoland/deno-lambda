import { assert } from "https://deno.land/std@0.93.0/testing/asserts.ts";

const UNPKG = "https://unpkg.com/@types/aws-lambda@8.10.76/";

// Get the index file
const indexReq = await fetch(`${UNPKG}index.d.ts`);
assert(indexReq.ok);
const indexFile = await indexReq.text();

async function extractImports(typesFile: string, baseUrl: string) {
  // Extract all imported files from this file
  const imports = [...typesFile.matchAll(/\nexport \* from [\"\'](.*)[\"\'];/g)].map((
    match,
  ) => [match, match[1].replace(/^\.\//, baseUrl).replace(/\/$/, "/index") + ".d.ts"]);

  const files = await Promise.all(imports.map(async (t) => {
    const [match, url] = t;
    console.log(url.toString())
    const req = await fetch(url.toString());
    assert(req.ok, "failed to fetch " + url);

    const text = await req.text();

    if (text.match(/\nexport \* from/g)) {
      await extractImports(text, new URL(match[1], baseUrl).href)
    }
    return [match, text];
  }));

  for (const t of files) {
    typesFile += t[1];
  }
  return typesFile;
}

let typesFile = await extractImports(indexFile, UNPKG);
console.log([...typesFile.matchAll(/\nexport \* from .*/g)])

typesFile = typesFile.replaceAll(
  /\nimport {(.|\n)*?} from ["'](.*?)["'];?/g,
  "",
);

typesFile = typesFile.replace("    callback: Callback<TResult>,\n", "");
typesFile = typesFile.replace("void | Promise<TResult>", "Promise<TResult>");

typesFile = typesFile.replace(/export \* from ["']\..*['"];/g, "");

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
