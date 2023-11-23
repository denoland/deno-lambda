# Deno Lambda Layer

A custom runtime for [deno](https://github.com/denoland/deno) applications.

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
    statusCode: 200,
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Hello World! Sent from deno ${Deno.version.deno} 🦕`,
  };
}
```

See the [README on GitHub](https://github.com/ehsankhfr/deno-lambda) for more
information.

---

AWS SAR is available on:
[AWS Serverless Application Repository](https://aws.amazon.com/serverless).

## License

MIT
