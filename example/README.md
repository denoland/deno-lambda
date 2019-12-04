# Serverless example

This example lambda application defines:

- A lambda layer from the `deno-lambda-layer.zip`.
- A DynamodDB table "candidates".
- Three lambda functions a list/get/submit.
- An API Gateway endpoint to these functions.

This is based on [_Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework_ blogpost by Shekhar Gulat](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/).

See the application described in `serverless.yml` and the exported functions in `api/candidates.ts`.

It can be deployed in a single step using [`serverless deploy`](https://serverless.com/framework/docs/providers/aws/guide/deploying/).

Note: The `serverless-scriptable-plugin` is used to compile (`deno fetch api/candidates.ts`)
so there is no init-time download/compilation step.

    DENO_DIR=.deno_dir deno fetch api/candidate.ts && cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT

---

TODO:

- [ ] Should layer be a distinct template/directory? Each full deploy pushes a new version of the layer, ideally this shouldn't be the case.
      https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/ ?
- [ ] Tests are included, require local-dynamodb to be running. Should part of CI.
