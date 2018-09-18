#! /usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const createFalconApp = require('../src');
const pkg = require('../package.json');
const { EOL } = require('os');

const availableExamples =
  createFalconApp
    .getAvailableExamples()
    .map(example => chalk.green(example))
    .join(', ') || chalk.red('<none>');

const getAppHelp = (packageManager, name) => {
  const pkgRun = packageManager === 'yarn' ? 'yarn' : 'npm run';

  return chalk.bold(`cd ${name}${EOL}${pkgRun} start`);
};

program
  .version(pkg.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(async (name, { example }) => {
    try {
      const { activeProjects, packageManager } = await createFalconApp({ name, example });
      console.log(chalk.green(`${EOL}Application created successfully!`));
      console.log(`All required dependencies were installed, so you don't need to worry about them.${EOL}`);

      if (activeProjects.length > 1) {
        console.log(
          `Generated ${chalk.green(name)} application contains ${chalk.green(activeProjects.length)} sub-applications`
        );
        console.log(
          `Please run the following code in separate terminals to start your applications in ${chalk.green(
            'development'
          )} mode${EOL}`
        );
      } else {
        console.log(
          `Please run the following code to start your application in ${chalk.green('development')} mode${EOL}`
        );
      }

      activeProjects.forEach(project => console.log(getAppHelp(packageManager, project) + EOL));
    } catch (e) {
      console.error(chalk.red('Failed to create app!'));
      console.error(chalk.red(e.message));
    }
  })
  .option('-e, --example <example-name>', `Create from Example app. Available options: ${availableExamples}`)
  .allowUnknownOption()
  .on('--help', () => 'messages.help')
  .parse(process.argv);
