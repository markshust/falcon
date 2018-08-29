const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { eraseLine } = require('ansi-escapes');

const getSpinner = msg => {
  const spinner = ora(msg);
  spinner.color = 'blue';
  spinner.start();

  return () => {
    spinner.stop();
    process.stdout.write(eraseLine);
  };
};

const examplesPath = path.resolve('./examples');

const getAvailableExamples = () => {
  try {
    return fs.readdirSync(examplesPath);
  } catch (e) {
    return [];
  }
};

const copyTemplate = ({ targetPath, templatePath }) => {
  const stopSinner = getSpinner(`Copying template files to ${targetPath} ...`);
  fs.copySync(templatePath, targetPath, {
    filter: src => !src.includes('/node_modules/')
  });
  stopSinner();
};

const createFalconApp = ({ name, example }) => {
  const targetPath = path.resolve(process.cwd(), name);
  const templatePath = path.resolve(examplesPath, example || 'shop-with-blog');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`"${templatePath}" template does not exist.`);
  }
  if (fs.existsSync(targetPath)) {
    throw new Error(`"${targetPath}" exists`);
  }

  copyTemplate({ targetPath, templatePath });
};

module.exports = createFalconApp;
module.exports.examplesPath = examplesPath;
module.exports.getAvailableExamples = getAvailableExamples;
