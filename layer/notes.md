
aws s3 cp ../deno-lambda-layer.zip s3://deno-layer/deno-lambda-layer_0.6.1.zip --acl public-read
sam publish --region us-east-1