const { Command, flags } = require('@oclif/command');
const getToken = require('./authentication');
const { getCurrentProjectDependencies } = require('./packages');
const { getIssues, processIssues } = require('./issues');


class GoodSamaritanCommand extends Command {
  async run() {
    const { flags } = this.parse(GoodSamaritanCommand);

    const token = await getToken(flags['reset-token']);

    const dependencies = await getCurrentProjectDependencies();

    const issues = await getIssues(dependencies, token);

    processIssues(issues);
  }
}

GoodSamaritanCommand.description = `Help make the world a better place by finding issues in open source dependencies of your NodeJS project that you can help with.
Only issues that are labeled as "help wanted" are shown by default.

https://github.com/stdavis/good-samaritan
`;

GoodSamaritanCommand.flags = {
  version: flags.version({ char: 'v' }),
  help: flags.help({ char: 'h' }),
  'reset-token': flags.boolean({
    char: 'r',
    description: 'reset your GitHub authentication token'
  })
};


module.exports = GoodSamaritanCommand;
