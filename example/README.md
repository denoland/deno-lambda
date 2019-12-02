# Serverless example

This example lambda application includes:

- A lamabda layer from the `deno-lambda-layer.zip`.
- A DynamodDB table "candidates".
- Three lambda functions a list/get/submnit.
- An API Gateway which sets up an endpoint for these.

This is based on [_Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework_ blogpost by Shekhar Gulat](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/).

See the application described in serverless.yml and the typsescript code in `api/candidates.ts`.

It can be deployed in a single step using `sls deploy`.

---

TODO:

- At the moment each deploy pushes a new version of the layer, this shouldn't be the case (perhaps these should be in a separate directory)?
  https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/

- Tests are included, require local-dynamodb to be running.

---

Note: The `serverless-scriptable-plugin` is used to compile (`deno fetch`) `api/candidates.ts` so that there is no init-timne download/compilation step.

    DENO_DIR=.deno_dir deno fetch api/candidate.ts && cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT

This is "undone" in the `bootstrap` script included in the deno-lambda-layer.
