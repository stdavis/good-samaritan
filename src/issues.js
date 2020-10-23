const { Octokit } = require('@octokit/rest');
const parseGitHubUrl = require('parse-github-url');
const { getRepoUrl } = require('./packages');
const cliProgress = require('cli-progress');

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

  const issues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      progressBar.increment({ packageName });
      const repoUrl = await getRepoUrl(packageName, dependencies[packageName]);

      if (repoUrl) {
        const { owner, name } = parseGitHubUrl(repoUrl);
        const issueList = await octokit.issues.listForRepo({
          owner,
          repo: name,
          state: 'open',
          updated: 'updated',
          direction: 'desc'
        });

        issues[packageName] = issueList.data;
      } else {
        console.log('no repository url found');
      }
    }
  }

  return issues;
};

const processIssues = (issues) => {
  /*
    issues: { dep: Issue[], dep2: Issue[] }
  */
  const isHelpWantedLabel = label => {
    return /help.wanted/.test(label.name.toLowerCase());
  };

  for (const packageName in issues) {
    if (Object.prototype.hasOwnProperty.call(issues, packageName)) {
      console.log(`${packageName}:`);

      issues[packageName].forEach(issue => {
        if (issue.labels.length && issue.labels.some(isHelpWantedLabel)) {
          console.log(`${issue.title} (${issue.labels.map(lbl => lbl.name).join(',')})`);
          console.log(issue.html_url);
        }
      });
    }
  }
};


module.exports = {
  getIssues,
  processIssues
};
