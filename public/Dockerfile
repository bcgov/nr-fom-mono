# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/nodejs-14:1-75.1652296492 as builder

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
USER root
RUN cd libs && \
    npm ci && \
    cd ../public && \
    npm ci && \
    npm run build:public && \
    rm -rf node_modules && \
    npm i typescript@~4.1.6 express@^4.17.1 helmet@^4.6.0

# Deployment container
# TODO (ask if it is ok to use caddy:2 image or whatelse we can do to install caddy). FROM registry.access.redhat.com/ubi8/ubi-micro
FROM caddy:2

# Vars - configured for local development
ENV FOM_ENV=dev

# Node packages and dependencies
COPY --from=builder /usr/bin/node /usr/bin/
COPY --from=builder /usr/lib64/libz.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlidec.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlienc.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libcrypto.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libssl.so.1.1 /usr/lib64/
COPY --from=builder /usr/lib64/libstdc++.so.6 /usr/lib64/
COPY --from=builder /usr/lib64/libgcc_s.so.1 /usr/lib64/
COPY --from=builder /usr/lib64/libbrotlicommon.so.1 /usr/lib64/

# Copy over app
WORKDIR /app
COPY --from=builder /app/public/node_modules ./node_modules
COPY --from=builder /app/public/dist ./dist
COPY --from=builder /app/public ./public
# TODO (remove this) COPY --from=builder /app/public/server.js .
COPY --from=builder /app/public/Caddyfile .

# Expose port - mostly a convention, for readability
EXPOSE 4300 2019

# Start up command
# TODO (remove this) ENTRYPOINT ["node", "server.js"]
ENTRYPOINT ["caddy", "run"]
# TODO (ask if it is ok to have USER move to after ENTRYPOINT)
# USER 1001 
