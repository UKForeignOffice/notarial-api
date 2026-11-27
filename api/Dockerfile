# ----------------------------
# Stage 1
# Base image contains the updated OS and
# It also configures the non-root user that will be given permission to copied files/folders in every subsequent stages
FROM node:24-alpine AS base
RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git

# ----------------------------
# Stage 2
# Build stage
# In this layer we build the api server
FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN npm ci --ignore-scripts=true --workspace @notarialapi/api --include-workspace-root
RUN npm run build --workspace @notarialapi/api
# reinstall only production deps
RUN npm ci --omit=dev --ignore-scripts=true --workspace @notarialapi/api --include-workspace-root


# ----------------------------
# Stage 3
# Build stage
# In this layer we copy the built output from stage 2, ensuring the docker image is as light as possible
FROM node:24-alpine AS dist
WORKDIR /usr/dist/app/api
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/include/node
COPY --from=build /usr/src/app/node_modules /usr/dist/app/node_modules
COPY --from=build /usr/src/app/api/node_modules node_modules
COPY --from=build /usr/src/app/api/config config
COPY --from=build /usr/src/app/api/dist dist

USER node
EXPOSE 9000
CMD [ "node", "dist/index.js" ]
