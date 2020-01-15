# Serverless example

Deploy in a single step using [`serverless deploy`](https://serverless.com/framework/docs/providers/aws/guide/deploying/).

This example lambda application defines in `serverless.yml`:

- A DynamodDB table "candidates".
- Three lambda functions list/get/submit in `api/candidate.ts`.
- An API Gateway endpoint to these functions.

Note: The `serverless-scriptable-plugin` is used to compile `api/candidate.ts` prior to upload
so there is no init-time download/compilation step.

```sh
# Install serverless-scriptable-plugin:
npm install --save-dev serverless-scriptable-plugin
```

---

This example is based on [_Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework_ blogpost by Shekhar Gulat](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/).
