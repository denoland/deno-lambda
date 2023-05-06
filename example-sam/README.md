# SAM

An example
[Serverless Application Model](https://aws.amazon.com/serverless/sam/) template.

### Deploy via

```sh
# During the sam build phase, through the Makefile, SAM will execute the commands needed to "build" the package.
# For still an unknown reason it is needed to run DENO_DIR=.deno_dir deno cache hello.ts command only the first time to create the .deno_dir directory
sam build && sam deploy --stack-name YOUR_APP_NAME --s3-bucket YOUR_BUCKET_NAME --s3-prefix YOUR_PREFIX --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
```

Note: The stack can only deploy to the same region as the s3 bucket.
