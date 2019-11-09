# deno on AWS Lambda

A deno runtime for AWS Lambda.

![ci status](https://github.com/hayd/deno_lambda/workflows/Test/badge.svg?branch=master)

## Quick Start

From the [AWS console](https://console.aws.amazon.com/lambda/):

1. Download zip files from the [releases](https://github.com/hayd/deno_lambda/releases) page.

2. Create a _layer_ and upload `deno-lambda-layer.zip`. Note its ARN.

<img width="828" alt="Create layer" src="https://user-images.githubusercontent.com/1931852/68455786-0b618100-01b1-11ea-988a-ba3a5810a8d5.png">

<img width="1122" alt="Layer created" src="https://user-images.githubusercontent.com/1931852/68455785-0b618100-01b1-11ea-9686-8ebefe3b00ff.png">

3. Create a lambda function from scratch with runtime "provide your own bootstrap".

<img width="1295" alt="Create function" src="https://user-images.githubusercontent.com/1931852/68455784-0ac8ea80-01b1-11ea-93ba-8c64a4e487e7.png">

<img width="1300" alt="Function created" src="https://user-images.githubusercontent.com/1931852/68455783-0ac8ea80-01b1-11ea-9d84-f0824549ffda.png">

4. Add a layer using the ARN above.

<img width="820" alt="Add layer to function" src="https://user-images.githubusercontent.com/1931852/68455782-0ac8ea80-01b1-11ea-9a1b-0a87f8052c25.png">

5. Upload deno-lambda-example.zip as function code.

<img width="1300" alt="Upload function code" src="https://user-images.githubusercontent.com/1931852/68455780-0ac8ea80-01b1-11ea-87ee-164abe110c77.png">

6. "Save". "Test" (use the default event).

<img width="1298" alt="Execution successful" src="https://user-images.githubusercontent.com/1931852/68455779-0ac8ea80-01b1-11ea-9204-67bf4cb1c250.png">

---

Lambda calls the hello.handler function:

```ts
// hello.ts

import { Context, Event } from "https://deno.land/x/lambda/mod.ts";

export async function handler(event: Event, context: Context) {
  return {
    statusCode: 200,
    body: `Welcome to deno ${Deno.version.deno} 🦕`
  };
}
```

_The default is hello.handler but this can be configured by the `Handler` setting._

## Configurations on top of the deno-lambda-layer

Once your lambda function use the _deno-lambda-layer_ it can be updated as usual.
Either in the editor or via CLI.

- Supports `Handler` i.e. setting the handler file and function.
- Using `HANDLER_EXT` can select other supported extension (default `ts`).
- Supports setting the DENO_DIR for storing cached assets, default `.deno_dir`.
- If you use `deno bundle` since there is no entry point so you need to import the runtime, see `runtime/bundle.ts` as an example.

Further configuration TBD.

## Creating your own function code zip with a DENO_DIR

Create a zip file which contains

- an entry point which exports an async function (e.g. `hello.ts`)
- any other files needed to run the entry file
- .deno_dir directory\*

\*You can use a different directory by passing it as the DENO_DIR environment variable.

### Prepare zip file to upload to AWS Lambda

We zip up the source files and the DENO_DIR, however unfortunately we need to do some
directory remapping since the directory lambda uses will likely differ from your PWD.

This is not required, but since DENO_DIR caches both remote files and compilation it is prefered to ship this alongside your function code to avoid both runtime compilation or remote fetching.

```
# Compile the handler (and fetch dependencies into DENO_DIR).
DENO_DIR=.deno_dir deno fetch hello.ts

rm -rf .deno_dir/LAMBDA_TASK_ROOT
cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
# Note: We do the inverse of this operation in bootstrap.

zip lambda.zip -x '.deno_dir/gen/file/*' -r .deno_dir hello.ts  # other source files
```

_TODO(hayd): write this as a deno script._

Note: If you use a different directory for your DENO_DIR you can do so,
but must set this as the DENO_DIR environment variable in the function.

## Examples

- [x] Hello example ([`deno-lambda-example.zip`](https://github.com/hayd/deno_docker/releases/))
- [ ] Web example (behind API Gateway).

## Via CLI

TODO(hayd): lookup these commands to create, update layers and functions (including using default role).

```
aws lambda create-function --function-name deno-func --zip-file fileb://lambda.zip --handler lambda.handler --runtime provided --role YOUR_ROLE

aws lambda invoke --function-name FUNCTION_NAME response.json && cat response.json
```

---

_Many thanks to [Yoshiya Hinosawa's blogpost](https://dev.to/kt3k/write-aws-lambda-function-in-deno-4b20) for the initial work on this runtime._
