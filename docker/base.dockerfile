FROM public.ecr.aws/lambda/provided:al2

ENV DENO_VERSION=1.45.2

ENV DENO_DIR=.deno_dir
ENV DENO_INSTALL_ROOT=/usr/local

ADD runtime/bootstrap ${LAMBDA_RUNTIME_DIR}/bootstrap
RUN yum install -q -y unzip \
 && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
         --output deno.zip \
 && unzip -qq deno.zip \
 && rm deno.zip \
 && chmod 755 deno \
 && mv deno /bin/deno \
 && chmod 755 ${LAMBDA_RUNTIME_DIR}/bootstrap \
 && yum remove -q -y unzip \
 && rm -rf /var/cache/yum
