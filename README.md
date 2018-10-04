# DEITY FALCON

[![Build Status](https://travis-ci.org/deity-io/falcon.svg?branch=master)](https://travis-ci.org/deity-io/falcon)
[![License: OSL-3.0](https://img.shields.io/badge/license-OSL--3.0-yellow.svg?style=flat-square)](https://opensource.org/licenses/OSL-3.0)
[![Blazing Fast](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg?style=flat-square)](https://twitter.com/acdlite/status/974390255393505280)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

<p align="center">
  <img alight="center" width="100" src="https://user-images.githubusercontent.com/1118933/46464650-2f40df00-c7c7-11e8-827c-576ce330cb06.png" />
</p>

## Introduction

DEITY Falcon is a platform agnostic PWA, stand-alone but modular library to be used with any e-commerce platform.

#### Technologies inside

- Apollo
- NodeJS
- Razzle
- GraphQL
- React
- Koa
- Jest (testing)

#### Community

Any contributions, small or big, are very welcome! Please take a look at our [Contributor guidelines](https://github.com/deity-io/falcon/blob/master/.github/CONTRIBUTING.md) and [Code of Conduct](https://github.com/deity-io/falcon/blob/master/.github/CODE_OF_CONDUCT.md)

Join the official chat channel

[Deity Community Slack](http://slack.deity.io)

## Requirements

NodeJS (8.x +) https://nodejs.org

Yarn (Optional, but recommended) https://yarnpkg.com


Yarn can be installed via `npm install -g yarn` or https://yarnpkg.com/lang/en/docs/install

## Starting a project

Use the project generator:

[Create-falcon-app](https://github.com/deity-io/falcon/tree/master/packages/create-falcon-app)

Out of the box it will connect to a public back-end service (Magento & WordPress), so you are able to start developing right away.

### Connecting to your own services

#### Magento

Install falcon-magento2-module in Magento 2

[falcon-magento2-module](https://github.com/deity-io/falcon-magento2-module)

#### WordPress

Install falcon-wordpress-module in WordPress

[falcon-wordpress-module](https://github.com/deity-io/falcon-wordpress-module)

#### Other platforms

Coming soon

#### Connecting to them

Inside ```server/config``` change ```apis.config``` to your instance's credentials

## Customizing the theme

Please check out https://github.com/deity-io/falcon/tree/master/packages/falcon-ui

## Basics

### Project Structure

[Falcon Client](https://github.com/deity-io/falcon/tree/master/packages/falcon-client)

[Falcon Server](https://github.com/deity-io/falcon/tree/master/packages/falcon-server)

## Advanced

Coming soon

### Code Splitting

### Dynamic routing

### State management

## Development quick start

Yarn and Node are required for core development

#### Adding new dependency for single package

```
cd package-name
yarn add dependency-name
```

#### Testing

There are 2 main scripts available - `test` and `test:coverage`:

- `test` in the root package.json file - triggers `test:coverage` script in every available package (it will be used by the CI system mainly)
- `test` in the module's package.json - runs Jest testing in "watch" mode (re-runs tests on every code change)
- `test:coverage` in the module's package.json runs Jest testing with enabled Coverage option

```
cd package-name
yarn test
yarn test:coverage
```

#### Example how to add @deity/falcon-client dependency into examples/shop-with-blog

package version needs to be specified as it's not yet published to npm registry

```
cd examples/shop-with-blog
yarn add @deity/falcon-client@1.0.0
```

Important thing now is all those packages are linked together so changing something in `@deity/falcon-client` will be automatically reflected in `shop-with-blog` example

### TODO
- jest for all packages
- changelog generation? - https://github.com/lerna/lerna-changelog
- learna publish packages to npm script?


