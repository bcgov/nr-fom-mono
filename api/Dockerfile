# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/nodejs-14:1-75.1652296492 as builder

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
USER root
RUN npm ci && \
    npm run build:api

# Deployment container
# FROM registry.access.redhat.com/ubi8/ubi-micro
FROM registry.access.redhat.com/ubi8/nodejs-14:1-75.1652296492

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
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port - mostly a convention, for readability
EXPOSE 3333

# Start up command
USER 1001
ENTRYPOINT ["node", "./dist/apps/api/main.js"]
