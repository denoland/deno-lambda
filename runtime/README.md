# deno on AWS Lambda

`mod.ts` exports types for writing handler functions:

```ts
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  return {
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
    headers: { "content-type": "text/html;charset=utf8" },
    statusCode: 200,
  };
}
```

_See [deno-lambda repository](https://github.com/hayd/deno-lambda) for more info
on running deno on AWS Lambda._

---

Note: The `bootstrap` script is the entrypoint used by AWS Lambda.
