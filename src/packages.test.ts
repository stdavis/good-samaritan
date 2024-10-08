import packageInfo from 'package-json';
import { describe, expect, it, vi } from 'vitest';
import { getCurrentProjectDependencies, getPackageInfo, getRepoUrl } from './packages.js';

vi.mock('package-json');
vi.mock('read-pkg');
describe('packages', () => {
  describe('getPackageInfo', () => {
    it('caches calls to packageInfo', async () => {
      // @ts-expect-error - mocking
      packageInfo.mockClear();
      await getPackageInfo('dep1', '^1.0.1');
      await getPackageInfo('dep1', '^1.0.1');

      // @ts-expect-error - mocking
      expect(packageInfo.mock.calls.length).toBe(1);
    });
  });

  describe('getRepoUrl', () => {
    it('returns the url', async () => {
      expect(await getRepoUrl('dep2', '1.1.1')).toBe('https://github.com/asdavis/another-good-module');
    });
    it('returns null if no repo or url', async () => {
      expect(await getRepoUrl('noRepo', '1.1.1')).toBeNull();
      expect(await getRepoUrl('noRepoUrl', '1.1.1')).toBeNull();
    });
  });

  describe('getCurrentProjectDependencies', () => {
    it('combines deps and dev deps', async () => {
      const expected = {
        dep1: '^1.0.1',
        dep2: '1.0.2',
        devDep1: '^5.0.0',
        devDep2: '3.0.0',
      };

      expect(await getCurrentProjectDependencies()).toEqual(expected);
    });
    it('searches sub-deps', async () => {
      const expected = {
        dep1: '^1.0.1',
        dep2: '1.0.2',
        devDep1: '^5.0.0',
        devDep2: '3.0.0',
        subDep: '1.1.1',
        subDep2: '2.2.2',
      };

      expect(await getCurrentProjectDependencies(true)).toEqual(expected);
    });
  });
});
