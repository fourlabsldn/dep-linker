/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs.extra');

class DepLinker {
  constructor() {
    this.projectRoot = './';
  }

  setRoot(root) {
    if (typeof root !== 'string') {
      throw new Error(`Invalid path to root. Expected String, and received ${typeof root}`);
    }
    this.projectRoot = root;
  }

  getPackageJson(root = this.projectRoot) {
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
   * @return {Array<String>} Array of dependency names
   */
  listDependencies() {
    const packageJson = this.getPackageJson();
    const dependencies = packageJson.dependencies || {};
    return Object.keys(dependencies);
  }

  /**
   * Returns a promise to be resolved when all files have been linked.
   * @method linkDependenciesTo
   * @param  {String} dest - Folder where dependencies will go.
   * @return {Promise} - To be resolved when all files have been copied.
   */
  linkDependenciesTo(dest) {
    if (typeof dest !== 'string') {
      throw new Error(`Not a valid destination folder: ${dest}`);
    }

    const dependencies = this.listDependencies();

    // Create all folders up to the destiny folder
    fs.mkdirpSync(dest);

    const linkingPromises = [];
    for (const depName of dependencies) {
      // relative paths
      const rLinkSource = path.join('./node_modules', depName);
      const rLinkDestiny = path.join(dest, depName);

      const linkSource = path.resolve(rLinkSource);
      const linkDestiny = path.resolve(rLinkDestiny);
      const linkType = 'dir';

      // Link content
      const linking = new Promise((resolve) => { // Check if file exists
        fs.access(linkDestiny, fs.F_OK, resolve);
      })
      .then((err) => new Promise((resolve) => { // Delete it if needed
        if (err) {
          // File doesn't exist, nothing to do.
          resolve();
        } else {
          // File exists, let's remove it.
          fs.unlink(linkDestiny, resolve);
        }
      }))
      .then((err) => {  // Report on errors
        if (err) { console.log(err); }
      })
      .then(() => new Promise((resolve) => { // Create simbolic link
        fs.symlink(linkSource, linkDestiny, linkType, resolve);
      }))
      .then((err) => {  // Report on errors
        if (err) { console.log(err); }
      });

      linkingPromises.push(linking);
    }

    return Promise.all(linkingPromises);
  }


  // Backward compatibility matters
  copyDependenciesTo(...args) {
    return this.linkDependenciesTo(...args);
  }
}

module.exports = new DepLinker();
