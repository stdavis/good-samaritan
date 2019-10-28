const { Command, flags } = require('@oclif/command');
const readPackage = require('read-pkg');
const packageInfo = require('package-json');
const parseGitHubUrl = require('parse-github-url');
const Octokit = require('@octokit/rest');
const { oauthLoginUrl } = require('@octokit/oauth-login-url');
const { cli } = require('cli-ux');
const { createServer } = require('http');
const stoppable = require('stoppable');


const OAUTH_CLIENT_ID = '98364a543e873178bcaa';
class GoodSamaritanCommand extends Command {
  async run() {
    cli.action.start('Please login to the site opening in your browser with your GitHub credentials');

    const token = await new Promise((resolve) => {
      const server = stoppable(createServer((request, response) => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        let body = '';
        request.on('data', (chunk) => {
          body += chunk.toString();
        });
        request.on('end', () => {
          resolve(JSON.parse(body).token);
          cli.action.stop('login successful');

          response.end();
          server.stop();
        });
      }));

      server.listen(0, () => {
        const { url } = oauthLoginUrl({
          clientId: OAUTH_CLIENT_ID,
          state: server.address().port
        });
        cli.open(url);
      });
    });

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
        this.log(`${issue.title} (${issue.labels.map(lbl => lbl.name).join(',')})`);
        this.log(issue.url);
      }
    };
    const octokit = new Octokit({
      auth: token
    });
    for (const packageName in allDependencies) {
      if (allDependencies.hasOwnProperty(packageName)) {
        this.log(packageName);
        const info = await packageInfo(packageName, {
          version: allDependencies[packageName],
          fullMetadata: true
        });

        const { owner, name } = parseGitHubUrl(info.repository.url);
        const issues = await octokit.issues.listForRepo({
          owner,
          repo: name,
          state: 'open',
          updated: 'updated',
          direction: 'desc'
        });

        issues.data.forEach(processIssue);

        this.log('');
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
