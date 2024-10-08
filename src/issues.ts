import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import debugModule from 'debug';
import parseGitHubUrl from 'parse-github-url';
import { getRepoUrl } from './packages.js';

const debug = debugModule('good-samaritan');

export function getOctokitInstance(token: string): Octokit {
  const MyOctokit = Octokit.plugin(throttling, retry);

  return new MyOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter, options, octokit) => {
        octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

        // Retry twice after hitting a rate limit error, then give up
        if (options.request.retryCount <= 2) {
          console.log(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(`Secondary quota detected for request ${options.method} ${options.url}`);
      },
    },
  });
}

type Issue = RestEndpointMethodTypes['issues']['listForRepo']['response']['data'][0];
type PackageIssues = { issues: Issue[]; moreIssues: string | null };
type PackagesWithIssues = Record<string, PackageIssues>;

export async function getIssues(
  dependencies: Record<string, string>,
  octokit: Octokit,
  labels: string,
  maxIssues: number,
): Promise<PackagesWithIssues> {
  /*
    dependencies: { dep: <version string>, dep2: <version string> }
  */
  console.log('gathering issues from packages...');
  const progressBar = new cliProgress.SingleBar(
    {
      format: '{bar} {percentage}% | ETA: {eta}s | {message} ',
    },
    cliProgress.Presets.rect,
  );
  progressBar.start(Object.keys(dependencies).length, 0);

  const packageIssues: PackagesWithIssues = {};
  for (const packageName in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
      progressBar.increment({ message: `Package: ${packageName}` });

      let repo;
      try {
        repo = await getRepoFromPackage(packageName, dependencies[packageName]);
      } catch {
        continue;
      }

      let issues: Issue[] = [];
      let maxReached = false;
      try {
        for await (const response of octokit.paginate.iterator(octokit.issues.listForRepo, {
          ...repo,
          state: 'open',
          updated: 'updated',
          direction: 'desc',
          labels: labels,
        })) {
          issues = issues.concat(response.data);

          if (issues.length > maxIssues) {
            maxReached = true;
            issues = issues.slice(0, maxIssues);
            break;
          }
        }
      } catch (error) {
        debug(error);
      }

      if (issues.length > 0) {
        packageIssues[packageName] = {
          issues,
          moreIssues: maxReached
            ? `https://github.com/${repo.owner}/${repo.repo}/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22`
            : null,
        };
      }
    }
  }
  progressBar.update({ message: 'done' });
  progressBar.stop();

  return packageIssues;
}

async function getRepoFromPackage(packageName: string, version: string) {
  let repoUrl;
  const error = new Error(`error getting repo from package ${packageName}: ${version}`);

  try {
    repoUrl = await getRepoUrl(packageName, version);
  } catch (getRepoError) {
    debug(getRepoError);

    throw error;
  }

  if (repoUrl) {
    const parsedUrl = parseGitHubUrl(repoUrl);
    if (!parsedUrl || parsedUrl.name === null || parsedUrl.owner === null) {
      throw error;
    }

    return { owner: parsedUrl.owner, repo: parsedUrl.name };
  }

  throw error;
}

export function processIssues(packageIssues: PackagesWithIssues) {
  for (const packageName in packageIssues) {
    if (Object.prototype.hasOwnProperty.call(packageIssues, packageName)) {
      const { issues, moreIssues } = packageIssues[packageName];
      if (issues.length === 0) {
        return;
      }

      const numIssuesText = moreIssues ? `more than ${issues.length}` : issues.length;
      console.log(chalk.green.bold(`\n${packageName} (${numIssuesText} issues found):`));

      issues.forEach((issue) => {
        console.log(
          chalk.cyan(
            `${issue.title} (${issue.labels.map((lbl) => (typeof lbl === 'string' ? lbl : lbl.name)).join(',')})`,
          ),
        );
        console.log(chalk.italic.underline.dim(issue.html_url));
      });

      if (moreIssues) {
        console.log(chalk.yellow('Remaining issues can be found here:'));
        console.log(chalk.italic.underline.dim(moreIssues));
      }
    }
  }
}
