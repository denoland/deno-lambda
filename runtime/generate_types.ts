// This file generates mod.ts from types.d.ts

const typesFile = Deno.readTextFileSync("./types.d.ts");
const types = [...typesFile.matchAll(/export (type|interface) (.*?)\s/g)].map((
  match,
) => match[2].replaceAll(/<(.*)$/g, ""));
Deno.writeTextFileSync(
  "./mod.ts",
  `export type {\n  ${types.join(",\n  ")}\n } from \"./types.d.ts\";\n`,
);
