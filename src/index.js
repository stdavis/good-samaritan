const { Command, flags } = require('@oclif/command');
const readPackage = require('read-pkg');
const packageInfo = require('package-json');


class GoodSamaritanCommand extends Command {
  async run() {
    const packageJson = await readPackage();

    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    for (const packageName in allDependencies) {
      if (allDependencies.hasOwnProperty(packageName)) {
        this.log(packageName);
        const info = await packageInfo(packageName, {
          version: allDependencies[packageName],
          fullMetadata: true
        });
        this.log(info.bugs);
      }
    }
  }
}

GoodSamaritanCommand.description = `Find open issues from open source dependencies of your project.
...
Only issues that are marked as help wanted are shown by default.
`;

GoodSamaritanCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' })
};

module.exports = GoodSamaritanCommand;
