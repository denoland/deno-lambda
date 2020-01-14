# deno on AWS Lambda

A [deno](https://github.com/denoland/deno/) runtime for AWS Lambda.

_Deploy deno code via SAM, serverless, or bundle it yourself._

![ci status](https://github.com/hayd/deno-lambda/workflows/Test/badge.svg?branch=master)

Define a handler function, for example:

```ts
// hello.ts

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

_The default handler function is `hello.handler` but this can be configured by the `Handler` setting._

## Configuration

Lambda functions using the [_deno-lambda-layer_](https://github.com/hayd/deno-lambda/releases):

- Support `Handler` i.e. setting the handler file and function.
- Use `HANDLER_EXT` to set supported extension e.g. `js` or `bundle.js` (default `ts`).
- Set `DENO_DIR` for storing cached assets, default `.deno_dir`.

Further configuration TBD.

## Types

deno-lambda exports Definitely Typed's [aws-lambda types](https://www.npmjs.com/package/@types/aws-lambda),
listed in https://deno.land/x/lambda/mod.ts and defined in https://deno.land/x/lambda/types.d.ts.

It's good practice to reference the trigger's type in the handler, for example:
APIGateway use `APIGatewayProxyEvent` and `APIGatewayProxyResult`, SQS use `SQSEvent`, etc.

## Examples

- [x] Hello example ([`deno-lambda-example.zip`](https://github.com/hayd/deno-lambda/releases/))
- [x] Web example (behind API Gateway) using dynamodb, see `/example` directory.

## Deployment

### Serverless

See /example.

### SAM

See https://github.com/brianleroux/sam-example-deno.

### Layer

Deploy the layer via the
[SAR application](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:390065572566:applications~Deno)
or upload the
[deno-lambda-layer.zip](https://github.com/hayd/deno-lambda/releases)
manually (see `CONSOLE.md`). Reference the layer by ARN in your Lambda function.

## Warning

The way the lambda platform works means that promises not awaited in the handler
_may_ never be completed. This is because the underlying container can be suspended
between invocations and will sometimes be shutdown afterwards.

```ts
export async function badHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  somethingAsync(); // not awaited so may not complete
  return { statusCode: 200, body: "" };
}

export async function goodHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  await somethingAsync();
  return { statusCode: 200, body: "" };
}
```

If you need to return immediately but want to invoke a longer running process you can
[async-invoke](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html)
another lambda function (that does the `await somethingAsync()`).

## Bundling code

Create a zip file which contains:

- an entry point which exports an async function (e.g. `hello.ts`)
- any other files needed to run the entry file
- (optional) .deno_dir directory\*

\*You can use a different directory by passing it as the `DENO_DIR` environment variable.

_Alternatively you can use `deno bundle` command and upload a zipfile containing this js output._

### DENO_DIR remapping

Zip the source files and `DENO_DIR`. In order for compile artifacts to be recovered
(avoiding runtime compilation) you must do the following directory remapping:

```
# Compile the handler (and fetch dependencies into DENO_DIR).
DENO_DIR=.deno_dir deno fetch hello.ts

# This is the "remapping" step:
cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
# Note: We do the inverse of this operation in bootstrap.

zip lambda.zip -x '.deno_dir/gen/file/*' -r .deno_dir hello.ts  # other source files
```

In a `serverless.yml` this can be automatically prior to each upload using the
[`serverless-scriptable-plugin`](https://www.npmjs.com/package/serverless-scriptable-plugin):

```
plugins:
  - serverless-scriptable-plugin

custom:
  scriptHooks:
    before:package:createDeploymentArtifacts: DENO_DIR=.deno_dir deno fetch api/candidate.ts && cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
```

See `example/serverless.yml`.

---

_Many thanks to [Yoshiya Hinosawa's blogpost](https://dev.to/kt3k/write-aws-lambda-function-in-deno-4b20) for the initial work on this runtime._
