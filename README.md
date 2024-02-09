# deno on AWS Lambda

A [deno](https://github.com/denoland/deno/) runtime for AWS Lambda.

_Deploy deno code via
[docker container](https://github.com/denoland/deno-lambda/tree/master/example-docker-container)
or
[bundle it yourself](https://github.com/denoland/deno-lambda/blob/master/QUICK-START.md)._

![ci status](https://github.com/denoland/deno-lambda/workflows/Test/badge.svg?branch=master)

Define a handler function, for example:

```ts
// hello.ts

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

_Here the handler is `hello.handler` but this can be configured by the `Handler`
setting._

## Configuration

The following environment variables can be set to change deno-lambda's behavior:

- `HANDLER_EXT` to set supported extension of handler file e.g. `js` or
  `bundle.js` (default `ts`).
- `DENO_CONFIG` so deno runs with `--config=$DENO_CONFIG`.
- `DENO_DIR` so deno runs with `DENO_DIR=$DENO_DIR deno ...`.
- `DENO_IMPORTMAP` so deno runs with `--importmap=$DENO_IMPORTMAP`.
- `DENO_LOCATION` so deno runs with `--location=$DENO_LOCATION`.
- `DENO_LOCK` so deno runs with `--lock=$DENO_LOCK`.
- `DENO_PERMISSIONS` so deno only runs with a specific list of permissions. Deno
  lambda requires at least `--allow-env` and `--allow-net`.
- `DENO_PREFIX` prepends to console.log etc. a template literal, this can
  include `requestId` and `level` variables only (default
  `${level}\tRequestId: ${requestId}\r`).
- `DENO_UNSTABLE` so deno runs with the `--unstable`.

Further configuration TBD.

## Types

deno-lambda exports Definitely Typed's
[aws-lambda types](https://www.npmjs.com/package/@types/aws-lambda), listed in
https://deno.land/x/lambda/mod.ts and defined in
https://deno.land/x/lambda/types.d.ts.

It's good practice to reference the trigger's type in the handler, for example:
APIGateway use `APIGatewayProxyEventV2` and `APIGatewayProxyResultV2`, SQS use
`SQSEvent`, etc.

_Note: Despite there being multiple interfaces with the `Context` suffix, the
second handler argument must be `Context`. These other interfaces can be
accessed from the first argument (the event), for example `event.requestContext`
of an `APIGatewayProxyEventV2`._

## How to deploy

- [Docker container example](https://github.com/denoland/deno-lambda/tree/master/example-docker-container)
- [Bundle yourself](https://github.com/denoland/deno-lambda/blob/master/QUICK-START.md)

See the [deno_dir-remapping](#deno_dir-remapping) section for how to include the
correct DENO_DIR files to avoid any runtime compilation.

## Warning

The way the lambda platform works means that promises not awaited in the handler
_may_ never be completed. This is because the underlying container can be
suspended between invocations and will sometimes be shutdown afterwards.

```ts
export async function badHandler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  somethingAsync(); // not awaited so may not complete
  return { statusCode: 200, body: "" };
}

export async function goodHandler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  await somethingAsync();
  return { statusCode: 200, body: "" };
}
```

If you need to return immediately but want to invoke a longer running process
you can
[async-invoke](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html)
another lambda function (that does the `await somethingAsync()`).

## Related projects

- [deno support for architect](https://blog.begin.com/deno-runtime-support-for-architect-805fcbaa82c3)
- [deno on zeit now](https://github.com/lucacasonato/now-deno)
- [A layer for AWS Lambda that allows your functions to use `git` and `ssh`
  binaries](https://github.com/lambci/git-lambda-layer)

---

## Bundling code

Create a zip file which contains:

- an entry point which exports an async function (e.g. `hello.ts`)
- include any other files needed to run the entry file
- (optional but preferred) .deno_dir directory

*You can use a different directory with `DENO_DIR` environment variable.

_Alternatively use `deno bundle` command and include the outputted js file, see
also `HANDLER_EXT`._

## DENO_DIR remapping

In order for compile artifacts to be recovered (and avoid runtime compilation)
you must do the following directory remapping:

```
# Compile the handler (and cache dependencies and compile artifacts into DENO_DIR).
DENO_DIR=.deno_dir deno cache hello.ts

# This is the "remapping" step:
cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
# Note: We do the inverse of this operation in bootstrap.

zip lambda.zip -x '.deno_dir/gen/file/*' -r .deno_dir hello.ts  # other source files
```

## Testing locally with docker-lambda

You can execute deno-lambda locally using
[docker-lambda](https://github.com/lambci/docker-lambda). First, unzip the
[deno-lambda-layer.zip](https://github.com/denoland/deno-lambda/releases) layer
into a directory.

Now, from the directory of your application:

```sh
# replace LAYER_DIR with the directory you unzipped the layer to e.g. $PWD/layer
# replace hello.handler with your file/handler function
# replace '{}' with the json to pass to the handler
$ docker run -it --rm -v "$PWD":/var/task:ro,delegated -v "LAYER_DIR":/opt:ro,delegated lambci/lambda:provided.al2 hello.handler '{}'
# handler response from goes to stdout
```

To execute multiple times AKA "stay-open" API mode:

```sh
# replace LAYER_DIR with the directory you unzipped to e.g. $PWD/layer
# replace hello.handler with your file.handler function
$ docker run -e DOCKER_LAMBDA_STAY_OPEN=1 -p 9001:9001 -it --rm -v "$PWD":/var/task:ro,delegated -v "LAYER_DIR":/opt:ro,delegated lambci/lambda:provided.al2 hello.handler
Lambda API listening on port 9001...
```

and in another terminal:

```sh
# replace '{}' with the json to pass to the handler
$ aws lambda invoke --endpoint http://localhost:9001 --no-sign-request --function-name deno-func --payload '{}' output.json
# output.json is populated with the handler response
```

For more advanced usage, e.g. including multiple layers and installing
additional libraries (with [yumbda](https://github.com/lambci/yumda)), please
consult the [docker-lambda](https://github.com/lambci/docker-lambda)
documentation.

## Advanced logging

You can set the way `console.log` etc. outputs to cloudwatch logs using
`DENO_PREFIX`. You can include the line number using
`${(new Error).stack.split('\n')[4]}` or the datetime using
`${new Date().toISOString()}` (though the datetime of every cloudwatch event is
part of the event itself.

Use these as a template literal, for example:

    DENO_PREFIX=${level}\t${requestId}\t${(new Error).stack.split('\n')[4]}\r

This will prefix each log with the level, the request id and the line number:

<img width="385" alt="Screen Shot 2020-02-11 at 18 12 42" src="https://user-images.githubusercontent.com/1931852/74296949-313f7a00-4cfa-11ea-8293-e37a1712cd3d.png">

---

_Many thanks to
[Yoshiya Hinosawa's blogpost](https://dev.to/kt3k/write-aws-lambda-function-in-deno-4b20)
for the initial work on this runtime._
