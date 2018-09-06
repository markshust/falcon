# Shop with Blog Example

## Quick Start

Download the example [or clone the whole project](https://github.com/deity-io/falcon.git):

Install it and run:

```bash
yarn install
yarn start
```

Then open http://localhost:3000/ to see your app.

**That's it**. Just start editing `./src/App.js` and go!

## Testing

To run tests:

```bash
yarn test
```

This will run the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.


## Debugging

To run with debugger:

```bash
yarn start:dbg
```

This will start application with enabled inspector agent.

If the server should wait till debugger will attache then run:

```bash
yarn start:dbg-brk
```

For more information, see [this](https://github.com/deity-io/falcon/tree/master/packages/falcon-client#exposed-commands).

## Production package

To build and run production package:

```bash
yarn build
yarn start:prod
```

You could view your application at http://localhost:3000

## Idea behind the example

This is a basic example of Shop with Blog scenario.

If you would like to find more information about how it works please read about [@deity/falcon-client](https://github.com/deity-io/falcon/tree/master/packages/falcon-client)
