const path = require('path');
const fs = require('fs-extra');
const merge = require('deepmerge');

module.exports = class FalconI18nPlugin {
  /**
   * Webpack Plugin which merges localisation json files from specified directories and emit them into configurable directory.
   * Files emitting is done on compilation hook, which allows to import them and build chunks.
   * @param {{mainSource, defaultSources, output }} options - options
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
  }

  apply(compiler) {
    const { mainSource, defaultSources, output, filter } = this.options;

    this.localeFileDefinitions = this.getlocaleFileDefinitions(mainSource, defaultSources, filter);

    compiler.hooks.entryOption.tap(this.name, () => {
      fs.emptyDirSync(path.join(compiler.context, output));
    });
    compiler.hooks.compilation.tap(this.name, () =>
      this.openMergeAndWrite(this.localeFileDefinitions, output, compiler.context)
    );
    compiler.hooks.afterEmit.tap(this.name, compilation => this.watchSourceLocaleFiles(compilation));
  }

  /**
   * Get localizations file paths from specified directory.
   * @param {string} directory - directories to search for locales.
   * @param {string[]} lngFilter - languages which should be returned, if empty no filtration.
   * @param {string[]} nsFilter - namespaces which should be returned, if empty no filtration.
   * @returns {Object.<string, Object.<string, string[]>>} - language dictionary of namespace dictionary of file paths array.
   */
  getLocalizationFilePaths(directory, lngFilter = [], nsFilter = []) {
    return fs
      .readdirSync(directory)
      .filter(lng => fs.lstatSync(path.join(directory, lng)).isDirectory())
      .filter(lng => lngFilter.length === 0 || lngFilter.find(x => x === lng))
      .reduce(
        (languages, lng) =>
          merge(languages, {
            [lng]: fs
              .readdirSync(path.join(directory, lng))
              .filter(ns => path.extname(ns) === '.json')
              .map(ns => path.basename(ns, '.json'))
              .filter(ns => nsFilter.length === 0 || nsFilter.find(x => x === ns))
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

  getlocaleFileDefinitions(mainSource, defaultSourceDirs, filter) {
    const defaultI18nResources = defaultSourceDirs
      .filter(x => fs.pathExistsSync(x))
      .map(x => this.getLocalizationFilePaths(x, filter.lng, filter.ns))
      .reduce((mergeResult, x) => merge(mergeResult, x), {});
    const mainI18nResources = [mainSource].filter(x => fs.pathExistsSync(x)).map(x => this.getLocalizationFilePaths(x));
    const merged = merge.all([defaultI18nResources, ...mainI18nResources]);

    return this.flattenFilePathsDictionaries(merged);
  }

  /**
   * Produce flat array of {lng, ns, sources}
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
   * @param {string} output - directory where localization files should be stored
   * @param {string} relativeFrom - context path (required to ensure that output dir is created)
   * @returns {void}
   */
  openMergeAndWrite(sourceDefinitions, output, relativeFrom) {
    sourceDefinitions.forEach(({ lng, ns, sources }) => {
      const outputFileRelativePath = path.relative(relativeFrom, `${path.join(output, lng, ns)}.json`);
      const outputFileFullName = path.join(relativeFrom, outputFileRelativePath);
      fs.ensureDirSync(path.dirname(outputFileFullName));

      const mergedContent = sources
        .map(x => path.relative(relativeFrom, x))
        .map(x => fs.readJsonSync(x, 'utf8'))
        .reduce((result, x) => merge(result, x), {});
      fs.writeJsonSync(outputFileFullName, mergedContent, { spaces: 2 });
    });
  }

  /**
   * Adds selected input files into webpack watch
   * @param {{}} compilation - webpack compilation
   * @returns {void}
   */
  watchSourceLocaleFiles(compilation) {
    this.localeFileDefinitions.forEach(definition =>
      definition.sources.forEach(file => {
        compilation.fileDependencies.add(file);
      })
    );
  }
};
