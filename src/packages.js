const readPackage = require('read-pkg');
const packageInfo = require('package-json');


const getCurrentProjectDependencies = async () => {
  const packageJson = await readPackage();

  let dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  for (let packageName in dependencies) {
    const subPackageDependencies = await getDependencies(packageName, dependencies[packageName]);

    dependencies = {
      ...subPackageDependencies,
      // preference for root-level dependencies
      ...dependencies
    };
  }

  return dependencies;
};

const getDependencies = async (packageName, version) => {
  // TODO: cache
  const info = await packageInfo(packageName, {
    version: version,
    fullMetadata: true
  });

  return {
    ...info.dependencies,
    ...info.devDependencies
  };
};

const getRepoUrl = async (packageName, version) => {
  const info = await packageInfo(packageName, {
    version: version,
    fullMetadata: true
  });

  return (info.repository && info.repository.url) ? info.repository.url : null;
};

module.exports = {
  getCurrentProjectDependencies,
  getRepoUrl
};
