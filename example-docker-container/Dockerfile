FROM denoland/deno-lambda:1.45.0

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
