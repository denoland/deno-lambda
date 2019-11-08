# deno on AWS Lambda

The `mod.ts` offers the `Context` and `Event` inteface for writing your handler function:

```ts
import { Context, Event } from "https://deno.land/x/lambda/mod.ts";

export async function handler(event: Event, context: Context) {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
```

_See the [homepage](https://github.com/hayd/deno_lambda) for more info._

---

The `runtime` script is the entrypoint used by AWS Lambda.

Note: The amz-deno executable is expected to be in the container, either from `deno-lambda-layer.zip`
or in the function code.

If you have not included the amz-deno, or there is some other issue then the Lambda function
_should_ exit immediately with an InitException, hopefully with a descriptive error message.
