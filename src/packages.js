const readPackage = require('read-pkg');
const packageInfo = require('package-json');


const getCurrentProjectDependencies = async () => {
  const packageJson = await readPackage();

  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
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
