const path = require('path');
const fs = require('fs-extra');
const merge = require('deepmerge');

module.exports = class FalconI18nLocalesPlugin {
  /**
   * Webpack Plugin which merges localisation json files from specified directories and emit them into configurable directory.
   * Files emitting is done on compilation hook, which allows to import them and build chunks.
   * @param {{sourceDirs, outputDir }} options - options
   */
  constructor({ sourceDirs = [], outputDir = 'public/locales', filter = { lng: [], ns: [] } }) {
    this.name = 'FalconI18nLocalesPlugin';
    this.options = {
      sourceDirs,
      outputDir,
      filter: {
        lng: filter && filter.lng ? filter.lng : [],
        ns: filter && filter.ns ? filter.ns : []
      }
    };
  }

  apply(compiler) {
    const { sourceDirs, outputDir, filter } = this.options;

    if (!Array.isArray(sourceDirs) || !sourceDirs.length) {
      return;
    }

    const allLocalizationFiles = merge.all(sourceDirs.map(x => this.getLocalizationFilePaths(x)));

    // console.log(JSON.stringify(allLocalizationFiles, null, 2));
    // TODO filter lng / ns
    this.localeFileDefinitions = this.getLngNsDictionaryFilePaths(allLocalizationFiles, outputDir, compiler.context);

    compiler.hooks.entryOption.tap(this.name, () => fs.emptyDirSync(path.join(compiler.context, outputDir)));
    compiler.hooks.compile.tap(this.name, () => this.openMergeAndWrite(this.localeFileDefinitions, compiler.context));
    compiler.hooks.afterEmit.tap(this.name, compilation => {
      this.localeFileDefinitions.forEach(definition =>
        definition.sources.forEach(file => {
          compilation.fileDependencies.add(file);
        })
      );
    });
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
   * Produce nested Dictionaries of relative file paths
   * @param {Object.<string, Object.<string, string[]>>} localizations - languages dictionary of namespaces dictionary of file paths array.
   * @param {string} outputDirectory - directory where localization files should be stored.
   * @param {string} relativeFrom - path to which all file paths should be relative from.
   * @returns {{sources: string[], output: string}[]} - language dictionary of namespace dictionary of file paths array.
   */
  getLngNsDictionaryFilePaths(localizations, outputDirectory, relativeFrom) {
    const result = [];
    Object.keys(localizations).forEach(lng => {
      Object.keys(localizations[lng]).forEach(ns => {
        result.push({
          sources: localizations[lng][ns].map(x => path.relative(relativeFrom, x)),
          output: path.relative(relativeFrom, `${path.join(outputDirectory, lng, ns)}.json`)
        });
      });
    });

    return result;
  }

  /**
   * Opens all JSON files from definition, merges and wtire
   * @param {{sources: string[], output: string}[]} definitions - array of definitions according to which merging should be performed.
   * @param {string} relativeFrom - context path (required to ensure that output dir is created)
   * @returns {void}
   */
  openMergeAndWrite(definitions, relativeFrom) {
    definitions.forEach(definition => {
      const outputFileFullName = path.join(relativeFrom, definition.output);
      fs.ensureDirSync(path.dirname(outputFileFullName));

      const filesToMerge = definition.sources.map(x => fs.readJsonSync(x, 'utf8'));
      const mergedContent = merge.all(filesToMerge);
      fs.writeJsonSync(outputFileFullName, mergedContent, { spaces: 2 });
    });
  }
};
