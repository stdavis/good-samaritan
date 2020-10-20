const { Command, flags } = require('@oclif/command');
const readPackage = require('read-pkg');
const { Octokit } = require('@octokit/rest');
const packageInfo = require('package-json');
const parseGitHubUrl = require('parse-github-url');
const getToken = require('./authentication');


const getIssues = async token => {
  const packageJson = await readPackage();

  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const isHelpWantedLabel = label => {
    return /help.wanted/.test(label.name.toLowerCase());
  };
  const processIssue = issue => {
    if (issue.labels.length && issue.labels.some(isHelpWantedLabel)) {
      console.log(`${issue.title} (${issue.labels.map(lbl => lbl.name).join(',')})`);
      console.log(issue.html_url);
    }
  };
  const octokit = new Octokit({
    auth: token
  });
  for (const packageName in allDependencies) {
    if (Object.prototype.hasOwnProperty.call(allDependencies, packageName)) {
      console.log(packageName);
      const info = await packageInfo(packageName, {
        version: allDependencies[packageName],
        fullMetadata: true
      });

      if (info.repository && info.repository.url) {
        const { owner, name } = parseGitHubUrl(info.repository.url);
        const issues = await octokit.issues.listForRepo({
          owner,
          repo: name,
          state: 'open',
          updated: 'updated',
          direction: 'desc'
        });

        issues.data.forEach(processIssue);
      } else {
        console.log('no repository url found');
      }

      console.log('');
    }
  }
};


class GoodSamaritanCommand extends Command {
  async run() {
    const { flags } = this.parse(GoodSamaritanCommand);

    const token = await getToken(flags['reset-token']);

    getIssues(token);
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
