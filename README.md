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

_Here the handler is `hello.handler` but this can be configured by the `Handler` setting._

## Configuration

The following environment variables can be set to change deno-lambda's behavior:

- `HANDLER_EXT` to set supported extension of handler file e.g. `js` or `bundle.js` (default `ts`).
- `DENO_CONFIG` so deno runs with `--config=$DENO_CONFIG`.
- `DENO_DIR` so deno runs with `DENO_DIR=$DENO_DIR deno ...`.
- `DENO_IMPORTMAP` so deno runs with `--importmap=$DENO_IMPORTMAP`.
- `DENO_LOCK` so deno runs with `--lock=$DENO_LOCK`.
- `DENO_PREFIX` prepends to console.log etc. a template literal,
  this can include `requestId` and `level` variables only
  (default `${level}\tRequestId: ${requestId}\r`).

Further configuration TBD.

## Types

deno-lambda exports Definitely Typed's [aws-lambda types](https://www.npmjs.com/package/@types/aws-lambda),
listed in https://deno.land/x/lambda/mod.ts and defined in https://deno.land/x/lambda/types.d.ts.

It's good practice to reference the trigger's type in the handler, for example:
APIGateway use `APIGatewayProxyEvent` and `APIGatewayProxyResult`, SQS use `SQSEvent`, etc.

## How to deploy

The recommended way to deploy is to use the
[SAR application](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:390065572566:applications~deno)
and either reference the outputted `LayerArn` as a layer in your function.

- [SAR application](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:390065572566:applications~deno)
- [SAM example](https://github.com/hayd/deno-lambda/tree/master/example-sam)
- [Serverless example](https://github.com/hayd/deno-lambda/tree/master/example-serverless)
  (feat. [Dynamodb](https://github.com/chiefbiiko/dynamodb/))
- Zipped source example, [`deno-lambda-example.zip`](https://github.com/hayd/deno-lambda/releases/),
  see [bundling-code](https://github.com/hayd/deno-lambda/blob/master/README.md#bundling-code) section.

_See [`QUICK-START.md`](https://github.com/hayd/deno-lambda/blob/master/QUICK-START.md)
for a walkthrough of how to bundle yourself._

See the [deno_dir-remapping](https://github.com/hayd/deno-lambda/blob/master/README.md#deno_dir-remapping)
section for how to include the correct DENO_DIR files to avoid any runtime compilation.

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

## Related projects

- [deno support for architect](https://blog.begin.com/deno-runtime-support-for-architect-805fcbaa82c3)
- [A layer for AWS Lambda that allows your functions to use `git` and `ssh` binaries](https://github.com/lambci/git-lambda-layer)

---

## Bundling code

Create a zip file which contains:

- an entry point which exports an async function (e.g. `hello.ts`)
- include any other files needed to run the entry file
- (optional) .deno_dir directory

\*You can use a different directory with `DENO_DIR` environment variable.

_Alternatively use `deno bundle` command and include the outputted js file._

## DENO_DIR remapping

In order for compile artifacts to be recovered (and avoid runtime compilation)
you must do the following directory remapping:

```
# Compile the handler (and fetch dependencies into DENO_DIR).
DENO_DIR=.deno_dir deno fetch hello.ts

# This is the "remapping" step:
cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
# Note: We do the inverse of this operation in bootstrap.

zip lambda.zip -x '.deno_dir/gen/file/*' -r .deno_dir hello.ts  # other source files
```

### Serverless pre-deploy remapping

In a `serverless.yml` this can be automatically prior to each upload using the
[`serverless-scriptable-plugin`](https://www.npmjs.com/package/serverless-scriptable-plugin):

```
plugins:
  - serverless-scriptable-plugin

custom:
  scriptHooks:
    before:package:createDeploymentArtifacts: DENO_DIR=.deno_dir deno fetch api/candidate.ts && cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
```

See [`example-serverless/serverless.yml`](https://github.com/hayd/deno-lambda/blob/master/example-serverless/serverless.yml).

---

_Many thanks to [Yoshiya Hinosawa's blogpost](https://dev.to/kt3k/write-aws-lambda-function-in-deno-4b20) for the initial work on this runtime._
