const fs = require('fs-extra');

/**
 * Determines whether or not a given path exists.
 * @param {string} path The path to check for existence.
 * @returns {Promise<boolean>} true if the path exists, false if not.
 */
function exists(path) {
  return new Promise((resolve) =>
    fs.access(
      path,
      fs.constants.F_OK,
      error => resolve(!error)
    )
  );
}

module.exports = exists;
