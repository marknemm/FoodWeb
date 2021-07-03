const isPortReachable = require('is-port-reachable');

/**
 * Gets the host that is listening on a given port.
 * Will first ping localhost to see if the port is bound locally,
 * if not, then will try a given docker host.
 * @param {string | number} port The port number to ping.
 * @param {string} dockerHost The docker hostname to ping.
 * @return {Promise<string>} A promise that resolves to the host that the given port is bound on.
 * If neither localhost or `dockerHost`, then an empty string is returned.
 */
async function getHost(port, dockerHost) {
  if (await isPortReachable(port)) {
    return 'localhost';
  }

  if (await isPortReachable(port, { host: dockerHost })) {
    return dockerHost;
  }

  return '';
}

module.exports = {
  getHost
};
