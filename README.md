# Exchange Api



## Description

This is a simple chat app using commonly used design patterns and also to learn more `Nestjs` and other techs used on the backend side


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# watch mode
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# test ci
$ npm run test:ci

# test for debug
$ npm run test:debug
```

## Email template

```bash
# build email template wrote in the `mail-templates` file
$ npm run mail:build
```

## Prisma

[More about command](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

```bash
# generate migration
$ npm run gen:mig:dev

# pull data from the db to make the schema
$ npm run db:pull

# sync your Prisma schema and database schema without persisting a migration
$ npm run db:update

# applies all pending migrations, and creates the database if it does not exist
$ npm run db:deploy 

# reset migrations and db datas
$ npm run reset:db

# update prisma client to have intellisense
$ npm run prisma:update

# init seed to have default required value in the database
$ npm run db:init:default
```

## Lint

```bash
# prettier format code
$ npm run format

# eslint lintage
$ npm run lint
```