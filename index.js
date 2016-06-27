/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs.extra');

let projectRoot = './';

module.exports = class DepLinker {
  static setRoot(root) {
    if (typeof root !== 'string') {
      throw new Error(`Invalid path to root. Expected String, and received ${typeof root}`);
    }
    projectRoot = root;
  }

  static getPackageJson(root = projectRoot) {
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

  /**
   * Returns an object with dependency names and their filePath
   * @method listDependencies
   * @return {Object} each key is a dependency name and each vaule the dep's filePath
   */
  static listDependencies() {
    const packageJson = DepLinker.getPackageJson();
    const dependencies = packageJson.dependencies || {};

    const depPaths = {};
    for (const depName of Object.keys(dependencies)) {
      const depFilePath = require.resolve(depName);
      depPaths[depName] = depFilePath;
    }

    return depPaths;
  }

  /**
   * Returns a promise to be resolved when all files have been copied.
   * @method copyDependenciesTo
   * @param  {String} dest - Folder where dependencies will go.
   * @param  {Boolean} copyWholeFolder - Whether to copy just the main file or everything
   * @return {Promise} - To be resolved when all files have been copied.
   */
  static copyDependenciesTo(dest, copyWholeFolder = false) {
    if (typeof dest !== 'string') {
      throw new Error(`Not a valid destination folder: ${dest}`);
    }

    const dependencies = DepLinker.listDependencies();
    const copyPromises = [];
    const copyFunction = copyWholeFolder ? 'copyRecursive' : 'copy';
    const copyOptions = { replace: true };

    for (const depName of Object.keys(dependencies)) {
      let depDestiny;
      let depSource;

      // Specify source and destiny for dependency
      const depFilePath = dependencies[depName];
      if (copyWholeFolder) {
        const depDestinyFolder = path.join(dest, depName);
        depDestiny = depDestinyFolder;
        depSource = path.dirname(depFilePath);
      } else {
        depDestiny = path.format({
          dir: dest,
          name: depName,
          ext: path.parse(depFilePath).ext,
        });
        depSource = depFilePath;
      }

      // Copy content
      const copyPromise = new Promise((resolve) => {
        fs.mkdirpSync(dest);
        fs[copyFunction](
          depSource,
          depDestiny,
          () => resolve(),
          copyOptions
        );
      });
      copyPromises.push(copyPromise);
    }

    return Promise.all(copyPromises);
  }
};
