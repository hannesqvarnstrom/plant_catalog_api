FROM node:18 AS builder

WORKDIR /usr/src
COPY ["package.json", "package-lock.json", "tsconfig.json", "migrate.js", "./"]
COPY ./src ./src
RUN npm i
#EXPOSE 3000
RUN npm run build

FROM node:18
WORKDIR /usr/src
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/package.json ./
COPY --from=builder /usr/src/package-lock.json ./
COPY --from=builder /user/src/migrate.js ./
RUN npm ci --production
EXPOSE 3000
RUN npm run migrations:run
CMD ["node", "dist/index.js"]


# OLD DEV SETUP
# FROM node:18

# WORKDIR /usr/src
# COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
# COPY ./src ./src
# RUN npm i
# EXPOSE 3000
# CMD npm run dev

# # COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]


# # FROM node:16.13.1-alpine3.14
# # WORKDIR /usr/src/app


# # COPY ./src ./src

# # RUN npm install

# # CMD npm run dev