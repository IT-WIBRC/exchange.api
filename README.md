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

## Generate yaml file


    1. Run the server (Make sure that the database is running with valid configurations)

    2. Open it on the browser like [http://localhost:3000/exchange.yaml](http://localhost:3000/exchange.yaml)

    3. You will se the yaml file and then copy it and paste it into the file located (specs/exchange.yaml)

    4. Rename the operations name and remove empty properties


## First launching on the dev environment
 
```bash
# Build container in background on podman if using it
$ podman-compose up -d

# Build container in background on docker if using it
$ or docker-compose up -d

# Init database with schema and seeds
$ npm run init:dev

# Launch dev server
$ npm run dev
```

## Env variables

 `PORT`: port env (Default: 3000)
 `APP_ENV`: define the current env (Default: dev)

# DB

 `DATABASE_URL`: This is the database url used to have access to it

# Secrets

 `JWT_SECRET`: Secret used to hash the password
 `ROUNDS_OF_HASHING`: The round of hashing (Default: 10)

 `LOG_LEVEL`: log level
 `OTP_DIGIT`: The number of digit for the otp code
 `OTP_EXPIRATION_TIME`: the otp expiration time in minutes (Default: 10)

# Mail

 `MAIL_HOST`: Mail host (gmail or other) (Default: smtp.gmail.com)
 `MAIL_USER`: The user email that will send email to the client (optional)
 `MAIL_PASSWORD`: The app password created or token used by the email host to identify his client 
 `MAIL_PORT`: The port used by the mail provider (Default: 585)
 `MAIL_FROM`: The email used to send email to the app user 

# Providers token

GOOGLE_ACCESS_TOKEN
FACEBOOK_ACCESS_TOKEN