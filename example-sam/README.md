# SAM

An example [Serverless Application Model](https://aws.amazon.com/serverless/sam/) template.

### Deploy via

```sh
# Prior to deploy compile the application into .deno_dir.
# (ensure you're using the same version of deno as deno-lambda.)
DENO_DIR=.deno_dir deno cache hello.ts
cp -R .deno_dir/gen/file/$PWD/ .deno_dir/LAMBDA_TASK_ROOT
sam deploy --stack-name YOUR_APP_NAME --s3-bucket YOUR_BUCKET_NAME --s3-prefix YOUR_PREFIX --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
```

Note: The stack can only deploy to the same region as the s3 bucket.
