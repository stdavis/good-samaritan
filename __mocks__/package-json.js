module.exports = (packageName) => {
  const packages = {
    dep1: {
      repository: {
        url: 'https://github.com/stdavis/a-good-module'
      }
    },
    dep2: {
      repository: {
        url: 'https://github.com/asdavis/another-good-module'
      }
    },
    devDep1: {},
    devDep2: {
      repository: {}
    },
    noRepoUrl: {
      repository: {}
    },
    noRepo: {}
  };

  return packages[packageName];
};
