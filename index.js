/* eslint-env node */

const path = require('path');
const fs = require('fs.extra');

class DepLinker {
  constructor(rootFolder) {
    this.packageJson = this.getPackageJson(rootFolder);
  }

  getPackageJson(root = '.') {
    const packagePath = path.join(root, 'package.json');
    let packageText;
    try {
      packageText = fs.readFileSync(packagePath).toString();
    } catch (e) {
      throw new Error(`No package json found using path ${packagePath}`);
    }

    const packageJson = JSON.parse(packageText);
    return packageJson;
  }

  listDependencies() {
    const packageJson = this.packageJson;
    const dependencies = packageJson.dependencies;

    const depPaths = {};
    for (const depName of Object.keys(dependencies)) {
      const depFilePath = require.resolve(depName);
      const depFolderPath = path.dirname(depFilePath);
      depPaths[depName] = depFolderPath;
    }

    return depPaths;
  }

  /**
   * Returns a promise to be resolved when all files have been copied.
   */
  copyDependenciesTo(dest) {
    if (typeof dest !== 'string') {
      throw new Error(`Not a valid destination folder: ${dest}`);
    }

    const dependencies = this.listDependencies();
    const copyPromises = [];

    for (const depName of Object.keys(dependencies)) {
      const depDestiny = path.join(dest, depName);
      const depSource = dependencies[depName];

      const copyPromise = new Promise(
        (resolve) => { // eslint-disable-line no-loop-func
          fs.copyRecursive(
            depSource,
            depDestiny,
            () => resolve(),
            { replace: true }
          );
      });
      copyPromises.push(copyPromise);
    }

    return Promise.all(copyPromises);
  }
}

const depLinker = new DepLinker();
depLinker.copyDependenciesTo('./depTest')
  .then(() => {
    console.log('Finished.');
  })
  .catch((e) => {
    console.log(e);
  });
