# Contributing

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
