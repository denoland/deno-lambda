FROM denoland/deno-lambda:1.44.0

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
