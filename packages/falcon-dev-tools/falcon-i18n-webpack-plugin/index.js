const path = require('path');
const fs = require('fs-extra');
const merge = require('deepmerge');

module.exports = class FalconI18nPlugin {
  /**
   * Webpack Plugin which merges localisation json files from specified directories and emit them into configurable directory.
   * Files emitting is done on compilation hook, which allows to import them and build chunks.
   * @param {{sourceDirs, outputDir }} options - options
   */
  constructor({ sourceDirs = [], outputDir = 'public/locales', filter }) {
    this.name = 'FalconI18nPlugin';
    this.options = {
      sourceDirs,
      outputDir,
      filter: {
        lng: filter && Array.isArray(filter.lng) ? filter.lng : [],
        ns: filter && Array.isArray(filter.ns) ? filter.ns : []
      }
    };
  }

  apply(compiler) {
    const { sourceDirs, outputDir, filter } = this.options;

    if (!Array.isArray(sourceDirs) || !sourceDirs.length) {
      return;
    }

    const allLocalizationFiles = sourceDirs
      .filter(x => fs.pathExistsSync(x))
      .map(x => this.getLocalizationFilePaths(x))
      // TODO filter lng / ns
      .reduce((result, x) => merge(result, x), {});

    this.localeFileDefinitions = this.flattenFilePathsDictionaries(allLocalizationFiles); // this.getLngNsDictionaryFilePaths(allLocalizationFiles, outputDir, compiler.context);

    compiler.hooks.entryOption.tap(this.name, () => {
      fs.emptyDirSync(path.join(compiler.context, outputDir));
    });
    compiler.hooks.compilation.tap(this.name, () =>
      this.openMergeAndWrite(this.localeFileDefinitions, outputDir, compiler.context)
    );
    compiler.hooks.afterEmit.tap(this.name, compilation => this.watchSourceLocaleFiles(compilation));
  }

  /**
   * Get localizations file paths from specified directory.
   * @param {string} directory - directories to search for locales.
   * @returns {Object.<string, Object.<string, string[]>>} - language dictionary of namespace dictionary of file paths array.
   */
  getLocalizationFilePaths(directory) {
    return fs
      .readdirSync(directory)
      .filter(lng => fs.lstatSync(path.join(directory, lng)).isDirectory())
      .reduce(
        (languages, lng) =>
          merge(languages, {
            [lng]: fs
              .readdirSync(path.join(directory, lng))
              .filter(ns => path.extname(ns) === '.json')
              .map(ns => path.basename(ns, '.json'))
              .reduce(
                (namespaces, ns) => ({
                  ...namespaces,
                  [ns]: [path.join(directory, lng, `${ns}.json`)]
                }),
                {}
              )
          }),
        {}
      );
  }

  /**
   * Produce flat array of langauge, namesapec and sources
   * @param {Object.<string, Object.<string, string[]>>} localizations - languages dictionary of namespaces dictionary of file paths array.
   * @returns {{lng: string, ns: string, sources: string[]}[]} - array of file paths sources for lng and ns.
   */
  flattenFilePathsDictionaries(localizations) {
    const result = [];
    Object.keys(localizations).forEach(lng => {
      Object.keys(localizations[lng]).forEach(ns => {
        result.push({
          lng,
          ns,
          sources: localizations[lng][ns]
        });
      });
    });

    return result;
  }

  /**
   * Opens all JSON files from definition, merges and wtire
   * @param {{lng: string, ns: string, sources: string[]}[]} sourceDefinitions - array of definitions according to which merging should be performed.
   * @param {string} outputDir - directory where localization files should be stored
   * @param {string} relativeFrom - context path (required to ensure that output dir is created)
   * @returns {void}
   */
  openMergeAndWrite(sourceDefinitions, outputDir, relativeFrom) {
    sourceDefinitions.forEach(({ lng, ns, sources }) => {
      const outputFileRelativePath = path.relative(relativeFrom, `${path.join(outputDir, lng, ns)}.json`);
      const outputFileFullName = path.join(relativeFrom, outputFileRelativePath);
      fs.ensureDirSync(path.dirname(outputFileFullName));

      const mergedContent = sources
        .map(x => path.relative(relativeFrom, x))
        .map(x => fs.readJsonSync(x, 'utf8'))
        .reduce((result, x) => merge(result, x), {});
      fs.writeJsonSync(outputFileFullName, mergedContent, { spaces: 2 });
    });
  }

  watchSourceLocaleFiles(compilation) {
    this.localeFileDefinitions.forEach(definition =>
      definition.sources.forEach(file => {
        compilation.fileDependencies.add(file);
      })
    );
  }
};
