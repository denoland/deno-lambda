FROM denoland/deno-lambda:1.43.6

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
