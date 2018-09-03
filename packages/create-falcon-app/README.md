# Create Falcon App

Create your own Falcon-based application with a few commands:

```bash
npx create-falcon-app my-app
cd my-app
npm start
```

or with the `yarn create` command:

```bash
yarn create falcon-app my-app
cd my-app
yarn start
```

You can also initialize a project using one of our [example](./../../examples) templates:

```bash
npx create-falcon-app --example shop-with-blog my-custom-app
cd my-custom-app
npm start
```

or

```bash
yarn create falcon-app --example shop-with-blog my-custom-app
cd my-custom-app
npm start
```

> Please note, some example templates use multi-application structure
> (like `shop-with-blog` - it provides `client` and `server` sub-applications,
> which have to be launched via separate terminal sessions). More specific
> instructions will be provided at the end of the `create-falcon-app` call output.
