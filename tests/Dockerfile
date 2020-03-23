# Note: This must be built in the .. context

FROM hayd/amazonlinux1-deno:0.37.0
# This is the runtime used by AWS Lambda
# plus a compatible deno executable /bin/deno.
# https://github.com/hayd/deno_docker

RUN yum install -y unzip zip

ENV AWS_LAMBDA_RUNTIME_API=127.0.0.1:1993 \
    AWS_LAMBDA_FUNCTION_NAME=test \
    LAMBDA_TASK_ROOT=/var/task \
    AWS_LAMBDA_FUNCTION_VERSION=1 \
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE=128 \
    AWS_LAMBDA_LOG_GROUP_NAME=log-group \
    AWS_LAMBDA_LOG_STREAM_NAME=log-stream \
    PATH=/usr/local/bin:/usr/bin/:/bin:/opt/bin \
    LD_LIBRARY_PATH=/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib \
    _IN_DOCKER=true

# /var/task has function code
# /opt has the layer code
RUN mkdir -p /src/runtime/bin /src/tests/bin /var/task /opt \
 && cp /bin/deno /src/runtime/bin/deno \
 && cp /bin/deno /src/tests/bin/deno

ADD tests/deps.ts /src/tests/deps.ts
RUN deno fetch /src/tests/deps.ts

ADD hello.ts /src/runtime/hello.ts
ADD hello.ts /src/tests/hello.ts
ADD tests/pad.ts /src/runtime/pad.ts
ADD tests/pad.ts /src/tests/pad.ts
ADD runtime /src/runtime

WORKDIR /src/runtime
RUN sh artifacts \
 && cp hello.bundle.js /src/tests/hello.bundle.js \
 && cp bootstrap /src/tests/bootstrap

WORKDIR /src/tests
# Note: We have to run since fetch doesn't write!
RUN deno run --lock-write --lock=lock.json pad.ts \
 && echo {} > badlock.json

ADD tests/server.ts server.ts
RUN deno fetch server.ts

ADD tests/test.ts test.ts
RUN deno fetch test.ts

ADD tests .


ENTRYPOINT ["deno", "test", "-A"]
