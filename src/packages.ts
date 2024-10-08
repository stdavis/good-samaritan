import packageInfo, { FullMetadata, FullVersion } from 'package-json';
import { readPackage } from 'read-pkg';

export async function getCurrentProjectDependencies(searchSubDeps = false) {
  const packageJson = await readPackage();

  let dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (searchSubDeps) {
    for (const packageName in dependencies) {
      const subPackageDependencies = await getDependencies(packageName, dependencies[packageName]);

      if (subPackageDependencies) {
        dependencies = {
          ...(subPackageDependencies as Record<string, string>),
          // preference for root-level dependencies
          ...dependencies,
        };
      }
    }
  }

  return dependencies;
}

type PackageInfo = FullVersion & Pick<FullMetadata, 'time'>;
const PACKAGE_INFO_CACHE: Record<string, PackageInfo> = {};
export async function getPackageInfo(packageName: string, version: string): Promise<PackageInfo> {
  const key = `${packageName}-${version}`;
  if (PACKAGE_INFO_CACHE[key]) {
    return PACKAGE_INFO_CACHE[key];
  } else {
    const info = await packageInfo(packageName, {
      version,
      fullMetadata: true,
    });

    PACKAGE_INFO_CACHE[key] = info;

    return info;
  }
}

const getDependencies = async (packageName: string, version: string) => {
  const info = await getPackageInfo(packageName, version);

  return {
    ...info.dependencies,
  };
};

export async function getRepoUrl(packageName: string, version: string) {
  const info = await getPackageInfo(packageName, version);

  return info.repository && info.repository.url ? info.repository.url : null;
}
