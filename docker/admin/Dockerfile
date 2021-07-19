
FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim AS ui-admin
WORKDIR /usr/src/app/nr-fom-admin
# Filtered by .dockerignore
COPY . .
RUN npm ci && npm run build

FROM image-registry.openshift-image-registry.svc:5000/a4b31c-tools/node:14-slim AS server-build
RUN mkdir "/.npm"
RUN chown -R 1001:0 "/.npm"
RUN mkdir "/app"
RUN chown -R 1001:0 "/app"
USER 1001
WORKDIR /app
COPY --from=ui-admin /usr/src/app/nr-fom-admin/dist nr-fom-admin/dist
COPY ./openshift/node-server/* ./
RUN npm install

EXPOSE 4200

CMD ["node", "server.js"]
