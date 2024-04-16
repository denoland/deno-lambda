FROM denoland/deno-lambda:1.42.4

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
