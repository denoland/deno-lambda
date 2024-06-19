FROM denoland/deno-lambda:1.44.4

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
