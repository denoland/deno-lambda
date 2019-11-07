# This must be built in the .. context
FROM hayd/deno:amazonlinux-1-0.23.0

EXPOSE 1993

WORKDIR /lambda

RUN cp /bin/deno amz-deno
ADD runtime/. .
ADD tests .

ENV AWS_LAMBDA_RUNTIME_API=host.docker.internal:1993 \
    LAMBDA_TASK_ROOT=/lambda \
    AWS_LAMBDA_FUNCTION_VERSION=1 \
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE=128 \
    AWS_LAMBDA_LOG_GROUP_NAME=log-group \
    AWS_LAMBDA_LOG_STREAM_NAME=log-stream

# configurable
ENV AWS_LAMBDA_FUNCTION_NAME=hello
#DENO_DIR
#DENO_LAMBDA

ENTRYPOINT ["./bootstrap"]
