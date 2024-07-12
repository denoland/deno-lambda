FROM denoland/deno-lambda:1.45.2

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
