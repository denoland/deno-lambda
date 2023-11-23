FROM ehsankhfr/deno-lambda

COPY hello.ts .
RUN deno cache hello.ts


CMD ["hello.handler"]
