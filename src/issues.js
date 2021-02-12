const { Octokit } = require('@octokit/rest');
const parseGitHubUrl = require('parse-github-url');
const { getRepoUrl } = require('./packages');
const cliProgress = require('cli-progress');
const debug = require('debug')('good-samaritan');
const chalk = require('chalk');
const { throttling } = require('@octokit/plugin-throttling');
const { retry } = require('@octokit/plugin-retry');

const getOctokitInstance = (token) => {
  const MyOctokit = Octokit.plugin(throttling, retry);

  return new MyOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter, options, octokit) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );

        if (options.request.retryCount === 0) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onAbuseLimit: (_, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `Abuse detected for request ${options.method} ${options.url}`
        );
      }
    }
  });
};

const getIssues = async (dependencies, octokit, labels) => {
  /*
    dependencies: { dep: <version string>, dep2: <version string> }
  */
  console.log('gathering issues from packages...');
  const progressBar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | ETA: {eta}s | {message} '
  }, cliProgress.Presets.rect);
  progressBar.start(Object.keys(dependencies).length, 0);

  const packageIssues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      progressBar.increment({ message: `Package: ${packageName}` });

      let repo;
      try {
        repo = await getRepoFromPackage(packageName, dependencies[packageName]);
      } catch {
        continue;
      }

      let issues = [];
      try {
        for await (const response of octokit.paginate.iterator(
          octokit.issues.listForRepo,
          {
            ...repo,
            state: 'open',
            updated: 'updated',
            direction: 'desc',
            labels: labels
          }
        )) {
          issues = issues.concat(response.data);
        }
      } catch (error) {
        debug(error);
      }

      if (issues.length > 0) {
        packageIssues[packageName] = issues;
      }
    }
  }
  progressBar.update({ message: 'done' });
  progressBar.stop();

  return packageIssues;
};

const getRepoFromPackage = async (packageName, version) => {
  let repoUrl;
  const error = new Error(`error getting repo from package ${packageName}: ${version}`);

  try {
    repoUrl = await getRepoUrl(packageName, version);
  } catch (getRepoError) {
    debug(getRepoError);

    throw error;
  }

  if (repoUrl) {
    const { owner, name } = parseGitHubUrl(repoUrl);

    return { owner, repo: name };
  }

  throw error;
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
  processIssues,
  getOctokitInstance
};
