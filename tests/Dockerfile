# This must be built in the .. context
FROM hayd/deno:amazonlinux-1-0.23.0

ENV AWS_LAMBDA_RUNTIME_API=127.0.0.1:1993 \
    AWS_LAMBDA_FUNCTION_NAME=test \
    LAMBDA_TASK_ROOT=/lambda \
    AWS_LAMBDA_FUNCTION_VERSION=1 \
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE=128 \
    AWS_LAMBDA_LOG_GROUP_NAME=log-group \
    AWS_LAMBDA_LOG_STREAM_NAME=log-stream

WORKDIR /lambda

RUN cp /bin/deno amz-deno

ADD tests/deps.ts .
RUN deno fetch deps.ts

ADD runtime .
RUN deno bundle bundle.ts

ADD tests/server.ts .
RUN deno fetch server.ts

ADD tests/handlers.ts .
ADD tests/test.ts .
RUN deno fetch test.ts

ADD tests .


ENTRYPOINT ["deno", "-A", "test.ts"]
