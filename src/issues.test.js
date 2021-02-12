const { getIssues, processIssues, getOctokitInstance } = require("./issues");

describe('issues', () => {
  describe('getIssues', () => {
    it('collects issues', async () => {
      const octokit = getOctokitInstance();
      const mockIssues = {
        'a-good-module': ['stdavis issues'],
        'another-good-module': ['asdavis issues']
      };
      octokit.issues.listForRepo = jest.fn(({ repo }) => {
        return {
          data: mockIssues[repo]
        };
      });
      octokit.paginate.iterator = async function*(listFunction, args) {
        yield listFunction(args);
      };

      const dependencies = {
        'dep1': '1.1.1',
        'dep2': '1.2.2'
      };

      const result = await getIssues(dependencies, octokit, 'label');

      expect(result).toEqual({
        'dep2': ['asdavis issues'],
        'dep1': ['stdavis issues']
      });
    });
  });

  describe('processIssues', () => {
    it('prints issues to the output', () => {
      processIssues({
        dep1: [{
          labels: [{ name: 'help wanted' }, { name: 'hello' }],
          title: 'issue title',
          html_url: 'https://someurl.com'
        }, {
          labels: [{ name: 'hello' }],
          title: 'issue title',
          html_url: 'https://someurl.com'
        }],
        dep2: [{
          labels: [{ name: 'hello' }, { name: 'help-wanted' }],
          title: 'issue title two',
          html_url: 'https://someurl.com'
        }]
      });

      // runs without exception
      expect(true).toBeTruthy();
    });
  });
});
