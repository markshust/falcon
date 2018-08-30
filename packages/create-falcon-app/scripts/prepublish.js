const path = require('path');
const fs = require('fs-extra');
const { examplesPath } = require('../src');

const examplesSourcePath = path.resolve(__dirname, '../../../examples');

fs.emptyDirSync(examplesPath);
fs.copySync(examplesSourcePath, examplesPath);
