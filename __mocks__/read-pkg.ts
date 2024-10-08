import { vi } from 'vitest';

export const readPackage = vi.fn(() => {
  return {
    dependencies: {
      dep1: '^1.0.1',
      dep2: '1.0.2',
    },
    devDependencies: {
      devDep1: '^5.0.0',
      devDep2: '3.0.0',
    },
  };
});
