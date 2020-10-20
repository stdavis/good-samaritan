const { Octokit } = require('@octokit/rest');
const parseGitHubUrl = require('parse-github-url');
const { getRepoUrl } = require('./packages');

const getIssues = async (dependencies, token) => {
  const octokit = new Octokit({
    auth: token
  });

  const issues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      console.log(packageName);
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
