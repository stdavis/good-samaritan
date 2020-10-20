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

GoodSamaritanCommand.description = `Find open issues from open source dependencies of your project.
Only issues that are labeled as "help wanted" are shown by default.
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
