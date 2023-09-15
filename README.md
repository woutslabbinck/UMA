# Solid Application Interoperability playground for Community Solid Server
[![CI/CD](https://github.com/laurensdeb/authorization-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/laurensdeb/authorization-agent/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/laurensdeb/interoperability/branch/main/graph/badge.svg?token=YNT84QJT7G)](https://codecov.io/gh/laurensdeb/interoperability)

This repository is a fork of [laurensdb/interoperability](https://github.com/laurensdeb/interoperability).

This repository implements experimental [UMA](https://docs.kantarainitiative.org/uma/wg/rec-oauth-uma-grant-2.0.html) support for the Community Solid Server, an UMA Authorization Server (AS) and a client that follows the UMA protocol.
[ComponentsJS](https://componentsjs.readthedocs.io) and [HandlersJS](https://github.com/useid/handlersjs) were used for this purpose.

Furthermore, [HandlersJS](https://github.com/useid/handlersjs)
was copied here as some small changes were necessary to make it work here and so that other contributors do not need install from github packages


## Structure
The repository is structured as a [Lerna monorepo](https://lerna.js.org/), where different packages are used for the different functionality domains of the project:
- [`packages/css`](packages/css): Modules for introducing a UMA Authorization Service as an Authorizer in the Community Solid Server (version 4.1.0).
- [`packages/uma`](packages/uma): Modules implementing the necessary routes and API for a UMA Authorization Service.
- [`packages/http`](packages/http): HTTP server application for running the UMA AS and Authorization Agent modules as a server daemon.
- [`packages/util`](packages/util): Utility functions & classes
- [`packages/aa`](packages/interop): Implements modules for authorizing using the Application Interoperability specification and for providing Agent Registration discovery via an Authorization Agent.
- [`packages/interfaces`](packages/aa-interfaces): Interfaces for the Authorizer functionality of the UMA Authorization Service, to be used when implementing a new Authorizer strategy.
- `packages/handlerjs-*`: A clone with small modifications such that control over HandlerJS is local
- `test-UMA-flow`: A simple happy flow client.

## Getting started
In order to run this project you need to perform the following steps. Firstly, also ensure that you are using [`nvm`](https://github.com/nvm-sh/nvm) to manage your node version.

1. Run `npm install` in the project root
2. Run `npm run bootstrap`.

By default `npm run start` will boot up a Community Solid Server instance with UMA support alongside a UMA 
Authorization Service.

You can then execute the happy UMA flow by executing (in test-UMA-flow directory)
```sh
cd test-UMA-flow/
npx ts-node index.ts
```

## Next steps

I (Wout Slabbinck) will try to hack an Authorizer in the UMA AS (such as the current [AllAuthorizer](packages/uma/src/authz/AllAuthorizer.ts)) and include Koreografeye there for the research on Usage Control Patterns.