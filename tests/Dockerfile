# Note: This must be built in the .. context

FROM amazonlinux:2.0.20200722.0
# This is _close to_ the Amazon Linux 2 AMI/image used by AWS Lambda.

ENV DENO_VERSION=1.20.1

# Note: We make the deno binary private (via _) so that it's not available in the PATH.
# In order for `deno` to be made available in the PATH it must be inserted into ./bin/

RUN yum makecache \
 && yum install unzip zip -y \
 && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
         --output deno.zip \
 && unzip deno.zip \
 && rm deno.zip \
 && chmod 755 deno \
 && mv deno /bin/_deno \
 && yum clean all \
 && rm -rf /var/cache/yum

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
 && cp /bin/_deno /src/runtime/bin/deno \
 && cp /bin/_deno /src/tests/bin/deno

ADD tests/deps.ts /src/tests/deps.ts
RUN _deno cache /src/tests/deps.ts

ADD tests/hello.ts /src/runtime/hello.ts
ADD tests/hello.ts /src/tests/hello.ts
ADD tests/lock.ts /src/runtime/lock.ts
ADD tests/lock.ts /src/tests/lock.ts
ADD runtime /src/runtime
ADD runtime /var/runtime

# assert that the types are valid.
# FIXME this shouldn't be required (tests should import from runtime?)
RUN _deno run /src/runtime/mod.ts

WORKDIR /src/runtime
RUN sh artifacts \
 && cp hello.bundle.js /src/tests/hello.bundle.js \
 && cp bootstrap /src/tests/bootstrap

WORKDIR /src/tests
# Note: We have to run since fetch doesn't write!
RUN _deno cache --lock-write --lock=lock.json lock.ts \
 && echo {} > badlock.json

ADD tests/server.ts server.ts
RUN _deno cache server.ts

ADD tests/test.ts test.ts
RUN _deno cache test.ts

ADD tests .


CMD ["_deno", "test", "-A", "--unstable"]
