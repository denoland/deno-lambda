For deployment instructions please consult the
["configuration-images" section of the AWS Lambda
documentation](https://docs.aws.amazon.com/lambda/latest/dg/configuration-images.html).
(TODO enumerate the aws cli commands to deploy.)

The base image is published on dockerhub at
[hayd/deno-lambda](https://hub.docker.com/r/hayd/deno-lambda), and defined in
[hayd/deno-docker](https://github.com/hayd/deno-docker/tree/master/lambda).

Example `Dockerfile` below:

```Dockerfile
FROM hayd/deno-lambda:1.6.1

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
```

Note: hayd/deno-lambda's :version (1.6.1 above) coincides with the deno version.

To build your image:

    docker build -t <image name> .

To run your image locally:

    docker run -p 9000:8080 <image name>

In a separate terminal, you can then locally invoke the function using cURL:

    curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'

To learn more on deploying the function to ECR, check out the AWS documentation
on
[Creating a repository](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html)
and
[Pushing an image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html).

See also https://hub.docker.com/r/amazon/aws-lambda-provided which we extend.
