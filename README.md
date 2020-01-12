# deno on AWS Lambda

A [deno](https://github.com/denoland/deno/) runtime for AWS Lambda.

![ci status](https://github.com/hayd/deno-lambda/workflows/Test/badge.svg?branch=master)

See /example for usage with serverless.

## Quick Start

From the [AWS console](https://console.aws.amazon.com/lambda/):

1. Download zip files from the [releases](https://github.com/hayd/deno-lambda/releases) page.

2. Create a _layer_ and upload `deno-lambda-layer.zip`.

<img width="828" alt="Create layer" src="https://user-images.githubusercontent.com/1931852/68455786-0b618100-01b1-11ea-988a-ba3a5810a8d5.png">

<img width="1122" alt="Layer created" src="https://user-images.githubusercontent.com/1931852/68455785-0b618100-01b1-11ea-9686-8ebefe3b00ff.png">

Note its Version ARN.

3. Create a lambda function from scratch with runtime "provide your own bootstrap".

<img width="1295" alt="Create function" src="https://user-images.githubusercontent.com/1931852/68455784-0ac8ea80-01b1-11ea-93ba-8c64a4e487e7.png">

<img width="1300" alt="Function created" src="https://user-images.githubusercontent.com/1931852/68455783-0ac8ea80-01b1-11ea-9d84-f0824549ffda.png">

4. Add a layer using the ARN above.

<img width="820" alt="Add layer to function" src="https://user-images.githubusercontent.com/1931852/68455782-0ac8ea80-01b1-11ea-9a1b-0a87f8052c25.png">

5. Upload deno-lambda-example.zip as function code.

<img width="1300" alt="Upload function code" src="https://user-images.githubusercontent.com/1931852/68455780-0ac8ea80-01b1-11ea-87ee-164abe110c77.png">

6. "Save". "Test" (use the default event).

<img width="1277" alt="Execution successful" src="https://user-images.githubusercontent.com/1931852/70288824-bb61e400-1787-11ea-95a6-61bb3a260c05.png">

---

AWS Lambda calls the `hello.handler` function:

```ts
// hello.ts

import { APIGatewayProxyEvent, Context } from "https://deno.land/x/lambda/mod.ts";

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
```

_The default is `hello.handler` but this can be configured by the `Handler` setting._

### Warning

The way the lambda platform works means that promises not awaited by the handler
_may_ never be completed. This is because the underlying container can be paused
between invocations and will sometimes be shutdown.

```ts
export async function badHandler(event: APIGatewayProxyEvent, context: Context) {
  somethingAsync(); // not awaited
  return;
}

export async function goodHandler(event: APIGatewayProxyEvent, context: Context) {
  await somethingAsync();
  return;
}
```

If you need to return immediately but want to invoke a longer running process you can
[async-invoke](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html)
another lambda function (which does the `await somethingAsync()`).

---

## Configuration

Lambda functions using the [_deno-lambda-layer_](https://github.com/hayd/deno-lambda/releases):

- Support `Handler` i.e. setting the handler file and function.
- Use `HANDLER_EXT` to set supported extension e.g. `js` or `bundle.js` (default `ts`).
- Set `DENO_DIR` for storing cached assets, default `.deno_dir`.

Further configuration TBD.

## Function code

Create a zip file which contains:

- an entry point which exports an async function (e.g. `hello.ts`)
- any other files needed to run the entry file
- (optional) .deno_dir directory\*

\*You can use a different directory by passing it as the `DENO_DIR` environment variable.

### DENO_DIR remapping

Zip the source files and `DENO_DIR`. In order for compile artifacts to be recovered
(avoiding runtime compilation) you need to do the following directory remapping:

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

## Examples

- [x] Hello example ([`deno-lambda-example.zip`](https://github.com/hayd/deno-lambda/releases/))
- [x] Web example (behind API Gateway) using dynamodb, see `/example` directory.

---

_Many thanks to [Yoshiya Hinosawa's blogpost](https://dev.to/kt3k/write-aws-lambda-function-in-deno-4b20) for the initial work on this runtime._
