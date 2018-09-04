# Falcon i18n webpack plugin

This is a `@deity/falcon-i18n-webpack-plugin`, it allows to feed custom internationalisation resources by defaults translations.

## Options

- `mainSource: string` - relative path to custom i18n resources which should override defaults
- `defaultSources: string[]` - array of absolute paths to resources which should be merged to custom
- `output: string` - relative path to output directory
- `filter.lng: string[]` - array of language codes to filter `defaultSources` directories, if any, then only matching will be returned, otherwise all of them
- `filter.ns: string[]` - array of namespace codes to filter `defaultSources` directories, if any, then only matching will be returned, otherwise all of them

All paths should point to directories with file structure compatible with `{{lng}}/{{ns}}.json` pattern, e.g:

```
-en
|-common.json
|-blog.json
|-...
-...
```
