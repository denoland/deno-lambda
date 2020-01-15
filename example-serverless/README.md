# Serverless

Deploy in a single step using [`serverless deploy`](https://serverless.com/framework/docs/providers/aws/guide/deploying/).

The application defines in `serverless.yml`:

- Three exported handler functions list/get/submit in `api/candidate.ts`.
- An API Gateway endpoint for each of these functions.
- A DynamodDB table "candidates".

Note: The `serverless-scriptable-plugin` is used to compile `api/candidate.ts` prior to deployment
so that there is no init-time download/compilation step.

### Requirements

```sh
# Install the serverless cli
npm install -g serverless

# Install serverless-scriptable-plugin:
npm install -g serverless-scriptable-plugin
```

---

This example is based on [_Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework_ blogpost by Shekhar Gulat](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/).
