# falcon-ui

## TODO

- support top level themable hover, disabled, focus props?
- make `jest` tests working
- consider separating `as` prop to `tag` and `extend` - similar to https://github.com/jxnblk/styled-system/pull/267 ?
- separate theme to basic and featured?
- solve issue with SSR rendering of styles

  - https://github.com/emotion-js/emotion/issues/819
  - https://github.com/apollographql/react-apollo/pull/2304
  - https://github.com/ctrlplusb/react-tree-walker/issues/40

- move components to separate folders?
- how to run yarn build when yarn install gets executed? - https://github.com/yarnpkg/yarn/issues/3911
- track https://github.com/frenic/csstype/issues/8#issuecomment-403489436 for better intellisense of css
- track https://github.com/prettier/prettier/pull/4975 - for prettier support in mdx files
- add https://github.com/Andarist/babel-plugin-annotate-pure-calls - should help with tree shaking?
- add https://www.npmjs.com/package/tinycolor2 - color manipulation helpers?
- review https://github.com/final-form/react-final-form
- review https://github.com/bvaughn/react-window
- support className fallback in theme?

- docs: solve issue with props table generation - https://github.com/pedronauck/docz/issues/240
- docs: add custom props table, separate custom and themable props? (current theme separate?)
- docs: rename docs to docs helpers? move outside src?
- docs: review `Button` component, add more docs, add variants ('primary', secondary?), add tests
- docs: review table component, add more docs, add tests
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
