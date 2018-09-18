#!/usr/bin/env node

// eslint-disable-next-line no-underscore-dangle
global.__SERVER__ = true;

const fs = require('fs');
const path = require('path');
const FalconServer = require('../src/index.js');

// get passed file name and create full path to that file
const createConfigFileName = process.argv[2];
const createConfigFilePath = path.join(process.cwd(), createConfigFileName);

// just make sure that file exists before using it
if (!fs.existsSync(createConfigFilePath)) {
  console.error(`ERROR: Passed config file: ${createConfigFileName} does not exist! Aborting.`);
  process.exit(1);
}

if (!fs.statSync(createConfigFilePath).isFile()) {
  console.error(`ERROR: Passed argument: ${createConfigFileName} is not a file! Aborting.`);
  process.exit(1);
}

let config = {};
try {
  const createConfig = require(createConfigFilePath); // eslint-disable-line import/no-dynamic-require
  config = typeof createConfig === 'function' ? createConfig() : createConfig;
} catch (ex) {
  console.error('ERROR: Cannot load configuration file. Details:');
  console.log(ex.stack);
  process.exit(1);
}

const server = new FalconServer(config);
server.start();
