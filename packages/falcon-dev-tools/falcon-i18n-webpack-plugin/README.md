# Falcon i18n webpack plugin

This webpack plugin allows to extend your custom internationalization resources by defaults translations.

## Options

- `mainSource: string` - relative path to your custom i18n resources which should extend defaults
- `defaultSources: string[]` - array of absolute paths to resources which should be merged to your custom i18n resources
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
