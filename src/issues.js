const { Octokit } = require('@octokit/rest');
const parseGitHubUrl = require('parse-github-url');
const { getRepoUrl } = require('./packages');
const cliProgress = require('cli-progress');
const debug = require('debug')('good-samaritan');
const chalk = require('chalk');

const getIssues = async (dependencies, token, labels) => {
  /*
    dependencies: { dep: <version string>, dep2: <version string> }
  */
  const octokit = new Octokit({
    auth: token
  });

  console.log('gathering issues from packages...');
  const progressBar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | ETA: {eta}s | {message} '
  }, cliProgress.Presets.rect);
  progressBar.start(Object.keys(dependencies).length, 0);

  const packageIssues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      progressBar.increment({ message: `Package: ${packageName}` });
      const repoUrl = await getRepoUrl(packageName, dependencies[packageName]);

      if (repoUrl) {
        const { owner, name } = parseGitHubUrl(repoUrl);
        const issues = await octokit.paginate(octokit.issues.listForRepo, {
          owner,
          repo: name,
          state: 'open',
          updated: 'updated',
          direction: 'desc',
          labels: labels
        });

        if (issues.length > 0) {
          packageIssues[packageName] = issues;
        }
      } else {
        debug(`no repository url found for: ${packageName}`);
      }
    }
  }
  progressBar.update({ message: 'done' });
  progressBar.stop();

  return packageIssues;
};

const processIssues = (packageIssues) => {
  /*
    packageIssues: { dep: Issue[], dep2: Issue[] }
  */
  for (const packageName in packageIssues) {
    if (Object.prototype.hasOwnProperty.call(packageIssues, packageName)) {
      const issues = packageIssues[packageName];
      if (issues.length === 0) {
        return;
      }

      console.log(chalk.green.bold(`\n${packageName} (${issues.length} issues found):`));

      issues.forEach((issue) => {
        console.log(chalk.cyan(`${issue.title} (${issue.labels.map(lbl => lbl.name).join(',')})`));
        console.log(chalk.italic.underline.dim(issue.html_url));
      });
    }
  }
};


module.exports = {
  getIssues,
  processIssues
};
