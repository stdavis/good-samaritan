const { Command, flags } = require('@oclif/command');
const getToken = require('./authentication');
const { getCurrentProjectDependencies } = require('./packages');
const { getOctokitInstance, getIssues, processIssues } = require('./issues');
const chalk = require('chalk');
const prettyMilliseconds = require('pretty-ms');

class GoodSamaritanCommand extends Command {
  async run() {
    const startTime = new Date();

    const { flags } = this.parse(GoodSamaritanCommand);

    const token = await getToken(flags['reset-token']);

    const dependencies = await getCurrentProjectDependencies(flags['search-sub-deps']);

    const issues = await getIssues(dependencies, getOctokitInstance(token), flags['labels'], flags['max-issues']);

    processIssues(issues);

    const endTime = new Date() - startTime;

    console.log(chalk.magenta(`\nTotal processing time: ${prettyMilliseconds(endTime)}`));
  }
}

GoodSamaritanCommand.description = `Help make the world a better place by finding GitHub issues for open source dependencies of your NodeJS project that you can help with.
Only issues that are labeled as "help wanted" are shown by default.

https://github.com/stdavis/good-samaritan
`;

GoodSamaritanCommand.flags = {
  version: flags.version({ char: 'v' }),
  help: flags.help({ char: 'h' }),
  'reset-token': flags.boolean({
    char: 'r',
    description: 'reset your GitHub authentication token'
  }),
  'labels': flags.string({
    char: 'l',
    description: `specifies the GitHub issue label(s) that are used by good-samaritan to filter issues.

Labels are specified as a comma-separated list. For example: "help wanted,good first issue". Only issues that have *all* of the labels will be shown.`,
    default: 'help wanted'
  }),
  'search-sub-deps': flags.boolean({
    char: 's',
    description: `[default: false] search sub-dependencies (dependencies of your project's dependencies)
Note: devDependencies of sub-dependencies are not searched.`,
    default: false
  }),
  'max-issues': flags.integer({
    char: 'm',
    description: `[default 10] specifies the maximum number of issues returned for each repo.
If more than the max is found, a URL is printed that the user can use to see the rest of the issues.`,
    default: 10
  })
};


module.exports = GoodSamaritanCommand;
