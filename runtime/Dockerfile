# This is the runtime used by Amazon Lambda.
# A compatible deno executable has been built already by hayd/deno_docker.
# https://github.com/hayd/deno_docker

FROM hayd/deno:amazonlinux-1-0.23.0
RUN /bin/deno eval "console.log('🦕  ' + Deno.version.deno)"
