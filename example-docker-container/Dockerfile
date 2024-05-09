FROM denoland/deno-lambda:1.43.2

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
