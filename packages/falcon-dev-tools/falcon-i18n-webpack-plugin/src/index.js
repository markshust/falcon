const path = require('path');
const fs = require('fs-extra');
const merge = require('deepmerge');

/**
 * Get localizations file paths from specified directory.
 * @param {string} directory - directories to search for locales.
 * @param {string[]} lngFilter - languages which should be returned, if empty no filtration.
 * @param {string[]} nsFilter - namespaces which should be returned, if empty no filtration.
 * @returns {Object.<string, Object.<string, string[]>>} - language dictionary of namespace dictionary of file paths array.
 */
function getLocalizationFilePaths(directory, lngFilter = [], nsFilter = []) {
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

/**
 * Produce flat array of {lng, ns, sources}
 * @param {Object.<string, Object.<string, string[]>>} localizations - languages dictionary of namespaces dictionary of file paths array.
 * @returns {{lng: string, ns: string, sources: string[]}[]} - array of file paths sources for lng and ns.
 */
function flattenFilePathsDictionaries(localizations) {
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

module.exports = function getI18nResourceFileDefinitions(mainSource, defaultSourceDirs, filter) {
  const defaultI18nResources = defaultSourceDirs
    .filter(x => fs.pathExistsSync(x))
    .map(x => getLocalizationFilePaths(x, filter.lng, filter.ns))
    .reduce((mergeResult, x) => merge(mergeResult, x), {});

  const mainI18nResources = [mainSource].filter(x => fs.pathExistsSync(x)).map(x => getLocalizationFilePaths(x));

  const merged = merge.all([defaultI18nResources, ...mainI18nResources]);

  return flattenFilePathsDictionaries(merged);
};
