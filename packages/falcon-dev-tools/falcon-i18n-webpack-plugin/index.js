const path = require('path');
const fs = require('fs-extra');
const merge = require('deepmerge');
const getI18nResourceFileDefinitions = require('./src');

module.exports = class FalconI18nPlugin {
  /**
   * Webpack Plugin which merges localization json files from specified directories and emit them into configurable directory.
   * Files emitting is done on compilation hook, which allows to import them and build chunks.
   * @param {{ mainSource, defaultSources, output }} options - options
   */
  constructor({ mainSource, defaultSources = [], output = 'public/i18n', filter }) {
    this.name = 'FalconI18nPlugin';

    if (!mainSource) {
      throw new Error(`${this.name}: mainSource is required!`);
    }

    this.options = {
      mainSource,
      defaultSources,
      output,
      filter: {
        lng: filter && Array.isArray(filter.lng) ? filter.lng : [],
        ns: filter && Array.isArray(filter.ns) ? filter.ns : []
      }
    };

    this.resourceFileDefinitions = getI18nResourceFileDefinitions(mainSource, defaultSources, filter);
  }

  apply(compiler) {
    const { output } = this.options;

    compiler.hooks.entryOption.tap(this.name, () => {
      fs.emptyDirSync(path.join(compiler.context, output));
      this.resourceFileDefinitions.forEach(x => this.createOutputResourceFile(x, output, compiler.context));
    });

    compiler.hooks.watchRun.tapAsync(this.name, (_compiler, done) => {
      this.getChangedFiles(_compiler)
        .reduce((result, file) => {
          const changedDef = this.resourceFileDefinitions.find(def => def.sources.some(x => x === file));

          return changedDef ? [...result, changedDef] : result;
        }, [])
        .forEach(x => this.createOutputResourceFile(x, output, _compiler.context));

      return done();
    });

    compiler.hooks.afterEmit.tap(this.name, compilation => this.watchSourceLocaleFiles(compilation));
  }

  getChangedFiles(compiler) {
    const { watchFileSystem } = compiler;
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;

    return Object.keys(watcher.mtimes);
  }
  /**
   * Opens all JSON files from definition, merges and writes
   * @param {{lng: string, ns: string, sources: string[]}} sourceDefinition - definition according to which merging should be performed.
   * @param {string} output - directory where localization files should be stored
   * @param {string} relativeFrom - context path (required to ensure that output dir is created)
   * @returns {void}
   */
  createOutputResourceFile(sourceDefinition, output, relativeFrom) {
    const { lng, ns, sources } = sourceDefinition;

    const outputFileName = path.join(output, lng, `${ns}.json`);
    const outputFileRelativePath = path.relative(relativeFrom, outputFileName);
    const outputFileFullName = path.join(relativeFrom, outputFileRelativePath);
    fs.ensureDirSync(path.dirname(outputFileFullName));

    const mergedContent = sources
      .map(x => path.relative(relativeFrom, x))
      .map(x => fs.readJsonSync(x, 'utf8'))
      .reduce((result, x) => merge(result, x), {});
    fs.writeJsonSync(outputFileFullName, mergedContent, { spaces: 2 });
  }

  /**
   * Adds selected input files into webpack watch
   * @param {{}} compilation - webpack compilation
   * @returns {void}
   */
  watchSourceLocaleFiles(compilation) {
    this.resourceFileDefinitions.forEach(definition =>
      definition.sources.forEach(file => {
        compilation.fileDependencies.add(file);
      })
    );
  }
};
