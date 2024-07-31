FROM denoland/deno-lambda:1.45.5

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
