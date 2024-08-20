FROM denoland/deno-lambda:1.46.0-rc.3

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
