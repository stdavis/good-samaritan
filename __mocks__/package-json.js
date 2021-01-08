module.exports = (packageName) => {
  const packages = {
    dep1: {
      repository: {
        url: 'https://github.com/stdavis/a-good-module'
      },
      dependencies: {
        subDep: '1.1.1'
      },
      devDependencies: {
        skip: '0.0.0'
      }
    },
    dep2: {
      repository: {
        url: 'https://github.com/asdavis/another-good-module'
      }
    },
    devDep1: {},
    devDep2: {
      repository: {},
      dependencies: {
        subDep2: '2.2.2'
      }
    },
    noRepoUrl: {
      repository: {}
    },
    noRepo: {},
    subDep: {
      repository: {}
    },
    subDep2: {
      repository: {}
    }
  };

  return packages[packageName];
};
