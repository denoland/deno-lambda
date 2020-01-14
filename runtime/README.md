# deno on AWS Lambda

`mod.ts` exports types, from `types.d.ts`, for writing handler functions:

```ts
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
```

_See [deno-lambda repository](https://github.com/hayd/deno-lambda) to run deno on AWS Lambda._

---

Note: The `bootstrap` script is the entrypoint used by AWS Lambda.
