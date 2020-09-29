const { Command, flags } = require('@oclif/command');
const fetch = require('node-fetch');
const { cli } = require('cli-ux');
const readPackage = require('read-pkg');
const { Octokit } = require('@octokit/rest');
const packageInfo = require('package-json');
const parseGitHubUrl = require('parse-github-url');


const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};
const OAUTH_CLIENT_ID = '98364a543e873178bcaa';

const authenticate = async () => {
  const codeResponse = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    body: JSON.stringify({
      client_id: OAUTH_CLIENT_ID,
      scope: null
    }),
    headers: jsonHeaders
  });
  const { device_code, user_code, verification_uri, interval } = await codeResponse.json();

  cli.action.start(`Please paste this device code into the site opening in your default browser: "${user_code}"`);
  cli.open(verification_uri);

  const hasVerified = async () => {
    const verifiedResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      }),
      headers: jsonHeaders
    });

    try {
      const response = await verifiedResponse.json();

      if (response.access_token) {
        cli.action.stop();

        return response.access_token;
      }

      return false;
    } catch (error) {
      console.log(error, verifiedResponse);

      return false;
    }
  };

  return new Promise((resolve) => {
    const intervalHandle = setInterval(async () => {
      const token = await hasVerified();

      if (token) {
        resolve(token);
        clearInterval(intervalHandle);
      }
      // if you check right at the allowed interval, it breaks the request
    }, (interval + 1) * 1000);
  });
};

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
      console.log(issue.url);
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

      const { owner, name } = parseGitHubUrl(info.repository.url);
      const issues = await octokit.issues.listForRepo({
        owner,
        repo: name,
        state: 'open',
        updated: 'updated',
        direction: 'desc'
      });

      issues.data.forEach(processIssue);

      console.log('');
    }
  }
};


class GoodSamaritanCommand extends Command {
  async run() {
    await authenticate();

    getIssues();
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
