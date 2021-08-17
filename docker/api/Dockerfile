
# FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim as build
FROM artifacts.developer.gov.bc.ca/docker-remote/node:14.17-slim as build
# FROM node:14-alpine

# Workaround npm limitation with building as non-root
USER 0

# Create and change to the app directory.
WORKDIR /opt/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies.
# If you add a package-lock.json speed your build by switching to 'npm ci'.
RUN npm ci 

# Copy local code to the container image.
COPY . .

RUN npm run build:api

FROM artifacts.developer.gov.bc.ca/docker-remote/node:14.17-slim as run
#FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim AS run

# Workaround npm limitation with installing as non-root
USER 0
RUN mkdir "/.npm"
RUN chown -R 1001:0 "/.npm"
RUN mkdir "/app"
RUN chown -R 1001:0 "/app"
USER 1001

WORKDIR /app
COPY --from=build /opt/app/dist .

COPY ./package*.json ./
RUN npm ci --only=production

# Expose API port
EXPOSE 3333

# Run the web service on container startup.
# Use entrypoint so that same image can be reused to run batch process with batch argument supplied.
ENTRYPOINT [ "node", "/app/apps/api/main.js" ]

