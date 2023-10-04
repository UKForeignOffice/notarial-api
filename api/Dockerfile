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
# Cache layer contains npm packages
# It will re-run only if one of the copied files change, otherwise this stage is cached
FROM base AS dependencies
WORKDIR /usr/src/app
COPY --chown=appuser:appuser .yarn ./.yarn/
COPY --chown=appuser:appuser package.json yarn.lock .yarnrc.yml tsconfig.json  ./
USER 1001
RUN --mount=type=cache,target=./.yarn/cache,id=base,uid=1001,mode=0755 yarn

# ----------------------------
# Stage 3
# Build stage
# In this layer we build the webhook server
# It will re-run only if anything inside ./webhook changes, otherwise this stage is cached.
FROM dependencies AS build-webhook
WORKDIR /usr/src/app
COPY --chown=appuser:appuser ./api/package.json ./api/tsconfig.json ./api/nodemon.json ./api/
COPY --chown=appuser:appuser ./api/config ./api/config
RUN --mount=type=cache,target=.yarn/cache,uid=1001,mode=0755,id=api \
    yarn workspaces focus @notarialapi/api
COPY --chown=appuser:appuser ./api/src ./api/src/
RUN yarn api build

USER 1001
EXPOSE 9000
CMD [ "yarn", "api", "start" ]
