import readPackage from 'read-pkg';
import packageInfo from 'package-json';

export const getCurrentProjectDependencies = async (searchSubDeps = false) => {
  const packageJson = await readPackage();

  let dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (searchSubDeps) {
    for (let packageName in dependencies) {
      const subPackageDependencies = await getDependencies(packageName, dependencies[packageName]);

      dependencies = {
        ...subPackageDependencies,
        // preference for root-level dependencies
        ...dependencies,
      };
    }
  }

  return dependencies;
};

const PACKAGE_INFO_CACHE = {};
export const getPackageInfo = async (packageName, version) => {
  let key = `${packageName}-${version}`;
  if (PACKAGE_INFO_CACHE[key]) {
    return PACKAGE_INFO_CACHE[key];
  } else {
    const info = await packageInfo(packageName, {
      version: version,
      fullMetadata: true,
    });

    PACKAGE_INFO_CACHE[key] = info;

    return info;
  }
};

const getDependencies = async (packageName, version) => {
  const info = await getPackageInfo(packageName, version);

  return {
    ...info.dependencies,
  };
};

export const getRepoUrl = async (packageName, version) => {
  const info = await getPackageInfo(packageName, version);

  return info.repository && info.repository.url ? info.repository.url : null;
};
