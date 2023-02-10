# Build container
FROM node:alpine3.16 AS build

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
RUN cd libs && \
    npm ci && \
    cd ../public && \
    npm ci && \
    npm run build:public && \
    rm -rf node_modules

# Deploy container
FROM caddy:2.4.6-alpine

# Vars - configured for local development
ENV FOM_ENV=dev

# Copy over app
WORKDIR /app
COPY --from=build /app/public/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/public/dist /srv

# Port and health check
EXPOSE 4300
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:4300

# User
USER 1001
