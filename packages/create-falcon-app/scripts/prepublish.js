const { resolve } = require('path');
const { emptyDirSync } = require('fs-extra');
const { copyFolder, examplesPath } = require('../src');

const examplesSourcePath = resolve(__dirname, '../../../examples');

emptyDirSync(examplesPath);
copyFolder(examplesSourcePath, examplesPath);
