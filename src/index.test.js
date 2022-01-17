import { test } from '@oclif/test';
import { jest } from '@jest/globals';
import getToken from './authentication';
import { getCurrentProjectDependencies } from './packages';
import { getIssues, processIssues } from './issues';
import cmd from '..';

jest.mock('./authentication');
getToken.mockResolvedValue('token');
jest.mock('./packages');
getCurrentProjectDependencies.mockResolvedValue({
  dep1: '^1.1.1',
  dep2: '^2.2.2',
});
jest.mock('./issues');
getIssues.mockResolvedValue({});

describe('index', () => {
  beforeEach(() => {});

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
