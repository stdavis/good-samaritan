const { getRepoUrl, getCurrentProjectDependencies } = require('./packages');


describe('packages', () => {
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
        devDep2: '3.0.0'
      };

      expect(await getCurrentProjectDependencies()).toEqual(expected);
    });
  });
});
