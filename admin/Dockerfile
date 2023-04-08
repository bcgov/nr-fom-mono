# Global args
ARG build_dir=admin
ARG port=4200


# Build container
FROM node:14.21.2-alpine3.17 AS build

# Install dependencies and build static content
ARG build_dir
WORKDIR /app
COPY ./libs ./libs
COPY ./${build_dir} ./${build_dir}
RUN cd libs && npm ci && cd .. && \
    cd ${build_dir} && npm ci && npm run build:${build_dir} && cd .. && \
    rm -rf libs/node_modules ${build_dir}/node_modules


# Deploy container
FROM caddy:2.6.4-alpine@sha256:eefd3d61e9ee8f35e046f614982d9a970006e3943c6e5f09957a4048f4c80d35

# Copy over Caddyfile and static content
ARG build_dir
COPY --from=build /app/${build_dir}/dist/${build_dir} /dist
COPY --from=build /app/${build_dir}/Caddyfile /etc/caddy/Caddyfile

# Port, health check and user
ARG port
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:${port}
USER 1001
