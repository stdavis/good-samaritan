const { Octokit } = require('@octokit/rest');
const parseGitHubUrl = require('parse-github-url');
const { getRepoUrl } = require('./packages');
const cliProgress = require('cli-progress');
const debug = require('debug')('good-samaritan');

const getIssues = async (dependencies, token) => {
  /*
    dependencies: { dep: <version string>, dep2: <version string> }
  */
  const octokit = new Octokit({
    auth: token
  });

  console.log('gathering issues from packages...');
  const progressBar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | ETA: {eta}s | Package: {packageName} ',
    stopOnComplete: true,
    clearOnComplete: true
  }, cliProgress.Presets.rect);
  progressBar.start(Object.keys(dependencies).length, 0);

  const packageIssues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      progressBar.increment({ packageName });
      const repoUrl = await getRepoUrl(packageName, dependencies[packageName]);

      if (repoUrl) {
        const { owner, name } = parseGitHubUrl(repoUrl);
        const issues = await octokit.paginate(octokit.issues.listForRepo, {
          owner,
          repo: name,
          state: 'open',
          updated: 'updated',
          direction: 'desc',
          labels: 'help wanted'
        });

        if (issues.length > 0) {
          packageIssues[packageName] = issues;
        }
      } else {
        debug(`no repository url found for: ${packageName}`);
      }
    }
  }

  return packageIssues;
};

const processIssues = (issues) => {
  /*
    issues: { dep: Issue[], dep2: Issue[] }
  */
  for (const packageName in issues) {
    if (Object.prototype.hasOwnProperty.call(issues, packageName)) {
      if (issues.length === 0) {
        return;
      }
      console.log(`${packageName}:`);

      issues[packageName].forEach(issue => {
        console.log(`${issue.title} (${issue.labels.map(lbl => lbl.name).join(',')})`);
        console.log(issue.html_url);
      });
    }
  }
};


module.exports = {
  getIssues,
  processIssues
};
