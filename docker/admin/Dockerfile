
FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim AS build
WORKDIR /tmp/fom
# Filtered by .dockerignore
COPY . .
RUN npm ci && npm run build:admin

FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim AS server
RUN mkdir "/.npm"
RUN chown -R 1001:0 "/.npm"
RUN mkdir "/app"
RUN chown -R 1001:0 "/app"
USER 1001
WORKDIR /app
COPY --from=build /tmp/fom/dist nr-fom-admin/dist
COPY ./docker/admin/node-server/* ./
RUN npm install

EXPOSE 4200

CMD ["node", "server.js"]
