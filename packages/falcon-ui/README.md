# falcon-ui

## TODO

- check if tree shaking is working
- test forwardRef
- make `jest` tests working
- try implementing more complex component
- support top level themable hover, disabled, focus props?
- solve issue with SSR rendering of styles

  - https://github.com/emotion-js/emotion/issues/819
  - https://github.com/apollographql/react-apollo/pull/2304
  - https://github.com/ctrlplusb/react-tree-walker/issues/40

- move components to separate folders?
- how to run yarn build when yarn install gets executed? - https://github.com/yarnpkg/yarn/issues/3911
- track https://github.com/frenic/csstype/issues/8#issuecomment-403489436 for better intellisense of css
- track https://github.com/prettier/prettier/pull/4975 - for prettier support in mdx files
- track: https://github.com/Microsoft/TypeScript/issues/26004
- track: https://github.com/mui-org/material-ui/pull/11731

- add https://github.com/Andarist/babel-plugin-annotate-pure-calls - should help with tree shaking?
- add https://www.npmjs.com/package/tinycolor2 - color manipulation helpers?
- review https://github.com/final-form/react-final-form
- review https://github.com/bvaughn/react-window
- support className fallback in theme?
- add https://github.com/reactjs/react-a11y ?
- docs: solve issue with props table generation - https://github.com/pedronauck/docz/issues/240
- docs: add custom props table, separate custom and themable props? (current theme separate?)

- docs: review `Button` component, add more docs, add variants ('primary', secondary?), add tests
- docs: review `Card` component, add more docs, add tests
- docs: review `Card` component, add more docs, add tests
- docs: review `FlexLayout` component, add docs, add tests
- docs: review `GridLayout` component, add docs, add tests
- docs: review `Root` component, add docs, add tests
- docs: review `Headings` component, add docs, add tests
- docs: add getting started similar to https://react-google-charts.com/?
- docs: add theming doc
  - document theming support via `createTheme`
  - document themable props
  - document css prop
  - document as prop
  - add something like https://pricelinelabs.github.io/design-system/Color ? or https://material-ui.com/style/color/#color-tool or https://github.com/cimdalli/mui-theme-generator ?

#### Required UI building blocks ?

| Component                                                     | Implementation | Tests | Docs |
| ------------------------------------------------------------- | -------------- | ----- | ---- |
| Button                                                        | ✓              |       |      |
| Headings (H1, H2, H3, H4)                                     | ✓              |       |      |
| Card                                                          |                |       |      |
| Table                                                         |                |       |      |
| FlexLayout - column based layout with rows of the same height |                |       |      |
| GridLayout - more complex layouts                             |                |       |      |
| Box - generic div component with theming support              |                |       |      |
| Paragraph                                                     |                |       |      |
| Absolute - renders as absolutely positioned element           |                |       |      |
| Relative - renders as relatively positioned element           |                |       |      |
| Divider                                                       |                |       |      |
| Image - should it support lazy loading of img src?            |                |       |      |
| Link                                                          |                |       |      |
| List                                                          |                |       |      |
| Arrow                                                         |                |       |      |
| Avatar                                                        |                |       |      |
| Navigation                                                    |                |       |      |
| Tabs                                                          |                |       |      |
| Group                                                         |                |       |      |
| BackgroundImage                                               |                |       |      |
| TextInput                                                     |                |       |      |
| RangeInput/Slider                                             |                |       |      |
| Label                                                         |                |       |      |
| Checkbox                                                      |                |       |      |
| Radio                                                         |                |       |      |
| Select                                                        |                |       |      |
| Toggle                                                        |                |       |      |
| Textarea                                                      |                |       |      |
| Tooltip                                                       |                |       |      |
| Menu                                                          |                |       |      |
| Badge/Chips                                                   |                |       |      |
| Toolbar                                                       |                |       |      |
| Sidebar/Drawer                                                |                |       |      |
| Overlay                                                       |                |       |      |
| Dialog                                                        |                |       |      |
| Accordion/Collapsible                                         |                |       |      |
| Progress                                                      |                |       |      |
| Banner                                                        |                |       |      |
| Portal?                                                       |                |       |      |
| RangeSelector?                                                |                |       |      |
| Icon?                                                         |                |       |      |
| Rating?                                                       |                |       |      |
| Carousel?                                                     |                |       |      |
| Zoom?                                                         |                |       |      |

## Conventional commits

based on https://conventionalcommits.org/

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

- `BREAKING CHANGE:` - a commit that has the text BREAKING CHANGE: at the beginning of its optional body or footer section introduces a breaking API change (correlating with MAJOR in semantic versioning). A BREAKING CHANGE can be part of commits of any type.
- `fix:` - a commit that patches a bug in your codebase (this correlates with PATCH in semantic versioning).
- `feat:` - a commit that introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).
- `improvement:` - a commit that improves a current implementation without adding a new feature or fixing a bug
- `build:` - a commit that with changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci:` - a commit that with changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `docs:` - a commit that with changes documentation only changes
- `perf:` - a commit with changes that improves performance
- `refactor:` - a commit with changes that neither are fixes a bug nor adds a feature
- `style:` - a commit with that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test:` - a commit with adding missing tests or correcting existing tests

#### Examples

- Commit message with description and breaking change in body:

```
feat: allow provided config object to extend other configs
BREAKING CHANGE:`extends`key in config file is now used for extending other config files
```

- Commit message with no body:

```
docs: correct spelling of CHANGELOG
```

- Commit message with scope:

```
feat(lang): added polish language
```

- Commit message for a fix using an (optional) issue number:

```
fix: minor typos in code

see the issue for details on the typos fixed

fixes issue #12
```
