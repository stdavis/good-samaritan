const { test } = require('@oclif/test');
const getToken = require('./authentication');
const { getCurrentProjectDependencies } = require('./packages');
const { getIssues, processIssues } = require('./issues');
const cmd = require('..');


jest.mock('./authentication');
getToken.mockResolvedValue('token');
jest.mock('./packages');
getCurrentProjectDependencies.mockResolvedValue({
  dep1: '^1.1.1',
  dep2: '^2.2.2'
});
jest.mock('./issues');
getIssues.mockResolvedValue({});

describe('index', () => {
  beforeEach(() => {
  });

  test
    .stdout()
    .do(() => cmd.run([]))
    .it('calls all functions', () => {
      expect(getToken).toHaveBeenCalled();
      expect(getCurrentProjectDependencies).toHaveBeenCalled();
      expect(getIssues).toHaveBeenCalled();
      expect(processIssues).toHaveBeenCalled();
    });
});
