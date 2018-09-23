const { defaults } = require('jest-config');

module.exports = {
  snapshotSerializers: ['jest-serializer-html'],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/docs'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transform: {
    // (.js, .ts, .jsx, .tsx) files
    '^.+\\.(j|t)sx?$': 'babel-jest'
  }
};
