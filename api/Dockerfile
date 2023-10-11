# ----------------------------
# Stage 1
# Base image contains the updated OS and
# It also configures the non-root user that will be given permission to copied files/folders in every subsequent stages
FROM node:18-alpine AS base
RUN npm install -g npm@latest && \
    mkdir -p /usr/src/app && \
    addgroup -g 1001 appuser && \
    adduser -S -u 1001 -G appuser appuser && \
    chown -R appuser:appuser /usr/src/app && \
    chmod -R +x  /usr/src/app && \
    apk update && \
    apk upgrade && \
    apk add --no-cache bash git

# ----------------------------
# Stage 2
# Build stage
# In this layer we build the api server
FROM dependencies AS build-webhook
WORKDIR /usr/src/app
COPY --chown=appuser:appuser ./api/package.json ./api/tsconfig.json ./api/nodemon.json ./api/
COPY --chown=appuser:appuser ./api/config ./api/config
RUN yarn workspaces focus @notarialapi/api
COPY --chown=appuser:appuser ./api/src ./api/src/
RUN yarn api build

USER 1001
EXPOSE 9000
CMD [ "yarn", "api", "start" ]
