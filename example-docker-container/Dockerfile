FROM denoland/deno-lambda:2.0.0-rc.0

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
