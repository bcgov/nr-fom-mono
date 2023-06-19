# RedHat UBI 8 with nodejs 16
FROM registry.access.redhat.com/ubi8/nodejs-18:1-47.1684740189 AS builder

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
USER root
RUN dnf install -y ca-certificates && \
    cd libs && npm ci && cd .. && \
    cd api && npm ci && npm run build:api

# Logs directory setup
RUN mkdir -p /app/logs
#RUN chmod 755 /app/logs
#RUN chown 1001:1001 /app/logs

# Deployment container
FROM registry.access.redhat.com/ubi8/ubi-micro

# Install tools
RUN microdnf install -y logrotate 

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
COPY --from=builder /etc/pki /etc/pki

# Copy over app
WORKDIR /app
COPY --from=builder /app/api/node_modules ./node_modules
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/api/src/migrations/main ./dist/api/src/migrations/main
COPY --from=builder /app/api/src/migrations/test ./dist/api/src/migrations/test

# Expose port - mostly a convention, for readability
EXPOSE 3333

# Start up command
USER 1001
ENTRYPOINT ["node", "./dist/api/src/main.js"]
