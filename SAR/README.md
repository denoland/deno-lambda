# Deno Lambda Layer

A custom runtime for [deno](https://github.com/denoland/deno) applications.

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
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Hello World! Sent from deno ${Deno.version.deno} 🦕`
  };
}
```

See the [README on github](https://github.com/hayd/deno-lambda) for more information.

---

Made with ❤️ by Andy Hayden.  
Available on the [AWS Serverless Application Repository](https://aws.amazon.com/serverless).

## License

MIT
