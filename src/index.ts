import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import prettyMilliseconds from 'pretty-ms';
import getToken from './authentication.js';
import { getIssues, getOctokitInstance, processIssues } from './issues.js';
import { getCurrentProjectDependencies } from './packages.js';

export default class GoodSamaritan extends Command {
  static description = `Help make the world a better place by finding GitHub issues for open source dependencies of your NodeJS project that you can help with.
Only issues that are labeled as "help wanted" are shown by default.

https://github.com/stdavis/good-samaritan
`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: Flags.help({ char: 'h' }),
    'reset-token': Flags.boolean({
      char: 'r',
      description: 'reset your GitHub authentication token',
    }),
    labels: Flags.string({
      char: 'l',
      description: `specifies the GitHub issue label(s) that are used by good-samaritan to filter issues.

Labels are specified as a comma-separated list. For example: "help wanted,good first issue". Only issues that have *all* of the labels will be shown.`,
      default: 'help wanted',
    }),
    'search-sub-deps': Flags.boolean({
      char: 's',
      description: `[default: false] search sub-dependencies (dependencies of your project's dependencies)
Note: devDependencies of sub-dependencies are not searched.`,
      default: false,
    }),
    'max-issues': Flags.integer({
      char: 'm',
      description: `[default 10] specifies the maximum number of issues returned for each repo.
If more than the max is found, a URL is printed that the user can use to see the rest of the issues.`,
      default: 10,
    }),
  };

  async run() {
    const startTime = new Date();

    const { flags } = await this.parse(GoodSamaritan);

    const token = await getToken(flags['reset-token']);

    const dependencies = await getCurrentProjectDependencies(flags['search-sub-deps']);

    const issues = await getIssues(dependencies, getOctokitInstance(token), flags['labels'], flags['max-issues']);

    processIssues(issues);

    const endTime = new Date().getTime() - startTime.getTime();

    console.log(chalk.magenta(`\nTotal processing time: ${prettyMilliseconds(endTime)}`));
  }
}
