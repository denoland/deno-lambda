FROM denoland/deno-lambda:1.42.0

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
