FROM node:18

WORKDIR /usr/src
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
COPY ./src ./src
RUN npm i
EXPOSE 3000
CMD npm run dev

# COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]


# FROM node:16.13.1-alpine3.14
# WORKDIR /usr/src/app


# COPY ./src ./src

# RUN npm install

# CMD npm run dev