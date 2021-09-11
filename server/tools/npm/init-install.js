require('../util/env');
const exec = require('../../../shared/tools/util/exec');
const path = require('path');
const { promises: fs } = require('fs');

initialInstall()
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Performs an initial `npm install` for a given Angular project if it is needed.
 * @return {Promise<void>} A promise that resolves once the initial install is complete.
 */
async function initialInstall() {
  const nodeModulesDir = path.join(global['serverDir'], 'node_modules');

  // Ensure that the node_modules directory exists.
  await fs.stat(nodeModulesDir).catch(() =>
    exec('npm install')
  );

  // Ensure that the node_modules directory is non-empty.
  if (!(await fs.readdir(nodeModulesDir)).length) {
    await exec('npm install');
  }
}
