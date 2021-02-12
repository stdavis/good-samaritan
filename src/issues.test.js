const { getIssues, processIssues, getOctokitInstance } = require("./issues");

describe('issues', () => {
  const largeIssueList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const maxIssues = 10;
  const octokit = getOctokitInstance();
  const mockIssues = {
    'a-good-module': ['stdavis issues'],
    'another-good-module': ['asdavis issues'],
    'lots-of-issues': largeIssueList
  };
  octokit.issues.listForRepo = jest.fn(({ repo }) => {
    return {
      data: mockIssues[repo]
    };
  });
  octokit.paginate.iterator = async function*(listFunction, args) {
    yield listFunction(args);
  };
  // see __mocks__/package-json.js for other mocks related to this test suite

  describe('getIssues', () => {
    it('collects issues', async () => {
      const dependencies = {
        'dep1': '1.1.1',
        'dep2': '1.2.2'
      };

      const result = await getIssues(dependencies, octokit, 'label', maxIssues);

      expect(result).toEqual({
        'dep2': {
          issues: ['asdavis issues'],
          moreIssues: null
        },
        'dep1': {
          issues: ['stdavis issues'],
          moreIssues: null
        }
      });
    });
    it('handles more than max number of issues', async () => {
      const dependencies = {
        'dep3': '1.1.1'
      };

      const result = await getIssues(dependencies, octokit, 'label', maxIssues);

      expect(result).toEqual({
        'dep3': {
          issues: largeIssueList.slice(0, maxIssues),
          moreIssues: 'https://github.com/stdavis/lots-of-issues/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22'
        }
      });
    });
  });

  describe('processIssues', () => {
    it('prints issues to the output', () => {
      processIssues({
        dep1: {
          issues: [{
            labels: [{ name: 'help wanted' }, { name: 'hello' }],
            title: 'issue title',
            html_url: 'https://someurl.com'
          }, {
            labels: [{ name: 'hello' }],
            title: 'issue title',
            html_url: 'https://someurl.com'
          }],
          moreIssues: null
        },
        dep2: {
          issues: [{
            labels: [{ name: 'hello' }, { name: 'help-wanted' }],
            title: 'issue title two',
            html_url: 'https://someurl.com'
          }],
          moreIssues: 'https://github.com/stdavis/good-samaritan-tests/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22'
        }
      });

      // runs without exception
      expect(true).toBeTruthy();
    });
  });
});
