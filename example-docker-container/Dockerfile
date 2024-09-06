FROM denoland/deno-lambda:2.0.0-rc.1

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
