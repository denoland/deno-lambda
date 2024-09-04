FROM denoland/deno-lambda:2.0.1

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
