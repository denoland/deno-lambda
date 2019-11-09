# This must be built in the .. context
FROM hayd/deno:amazonlinux-1-0.23.0

RUN yum install -y unzip zip

ENV AWS_LAMBDA_RUNTIME_API=127.0.0.1:1993 \
    AWS_LAMBDA_FUNCTION_NAME=test \
    LAMBDA_TASK_ROOT=/var/task \
    AWS_LAMBDA_FUNCTION_VERSION=1 \
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE=128 \
    AWS_LAMBDA_LOG_GROUP_NAME=log-group \
    AWS_LAMBDA_LOG_STREAM_NAME=log-stream \
    _IN_DOCKER=true

# /var/task has function code
# /opt has the layer code
RUN mkdir -p /src/runtime /src/tests /var/task /opt \
 && cp /bin/deno /src/runtime/amz-deno \
 && cp /bin/deno /src/tests/amz-deno

ADD tests/deps.ts /src/tests/deps.ts
RUN deno fetch /src/tests/deps.ts

ADD hello.ts /src/runtime/hello.ts
ADD hello.ts /src/tests/hello.ts
ADD tests/bundle.ts /src/runtime/bundle.ts

ADD runtime /src/runtime

WORKDIR /src/runtime
RUN sh artifacts \
 && cp bundle.bundle.js /src/tests/bundle.bundle.js \
 && cp bootstrap /src/tests/bootstrap

WORKDIR /src/tests
ADD tests/server.ts server.ts
RUN deno fetch server.ts

ADD tests/test.ts test.ts
RUN deno fetch test.ts

ADD tests .


ENTRYPOINT ["deno", "-A", "test.ts"]
