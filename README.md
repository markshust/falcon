# DEITY FALCON
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

#### Quick start
TODO
#### Development quick start
##### Installing dependencies for all packages
```
yarn install
```
Yarn can be installed via `npm install -g yarn` or https://yarnpkg.com/lang/en/docs/install
#### Adding new dependency for single package
```
cd package-name
yarn add dependency-name
```

##### Example how to add @deity/falcon-client dependency into examples/shop-with-blog
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


