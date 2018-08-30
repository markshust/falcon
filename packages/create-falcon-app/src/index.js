const { resolve } = require('path');
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

const examplesPath = resolve(__dirname, './../examples');

const getAvailableExamples = () => {
  try {
    return fs.readdirSync(examplesPath);
  } catch (e) {
    return [];
  }
};

const copyFolder = (source, dest) => {
  fs.copySync(source, dest, {
    filter: src => !src.match(/.*\/(node_modules|coverage|build).*/g)
  });
};

const copyTemplate = (templatePath, targetPath) => {
  const stopSinner = getSpinner(`Copying template files to ${targetPath} ...`);
  fs.copySync(templatePath, targetPath);
  stopSinner();
};

const createFalconApp = ({ name, example }) => {
  const targetPath = resolve(process.cwd(), name);
  const templatePath = resolve(examplesPath, example || 'shop-with-blog');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`"${templatePath}" template does not exist.`);
  }
  if (fs.existsSync(targetPath)) {
    throw new Error(`"${targetPath}" exists`);
  }

  copyTemplate(templatePath, targetPath);
};

module.exports = createFalconApp;
module.exports.copyFolder = copyFolder;
module.exports.examplesPath = examplesPath;
module.exports.getAvailableExamples = getAvailableExamples;
