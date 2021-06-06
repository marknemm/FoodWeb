import isPortReachable = require('is-port-reachable');
import { env } from '../globals/env';

/**
 * Gets a hostname (excludes protocol & port) from a given URL.
 * @param url The URL to get the hostname from.
 * @return The retrieved hostname. If there is none, then an empty string.
 */
export function getHostname(url: string): string {
  if (url) {
    const hostname: string = new URL(url).hostname;
    if (hostname) {
      return hostname;
    }
    return url.replace(/:\d{4}$/, '');
  }
  return '';
}

/**
 * Gets a port form a given URL.
 * @param url The URL to get the port from.
 * @param defaultPort The default port that shall be returned if the URL does not contain a port.
 * @return The retrieved port, or the given default port if there is none.
 */
export function getPort(url: string, defaultPort?: number): number {
  if (url) {
    const port: number = parseInt(new URL(url).port, 10);
    if (port && !isNaN(port)) {
      return port;
    }
  }
  return defaultPort;
}

/**
 * Given a list of hosts/urls, determines which host is reachable on a given port.
 * Useful for dynamically determining if a service is reachable on localhost or a docker host.
 * @param hosts The URLs/names of the hosts to ping.
 * @param port The port number to ping.
 * @return A promise that resolves to the host that the given port is bound on.
 * If none of the given hosts are reachable, then resolves to an empty string.
 */
export async function getReachableUrl(hosts: string[], port: string | number): Promise<string> {
  // Check if port is reachable on the given hosts.
  for (let host of hosts) {
    if (host) {
      // Ensure that if we are given a URL for any of the hosts, then we extract hostname.
      try { host = getHostname(host); } catch (err) { /* ignore since host is already just a hostname */ }
      console.log(`Checking host '${host}' with port '${port}'`);
      if (await isPortReachable(port, { host })) {
        console.log(`Can reach host '${host}' at port '${port}'`);
        return host;
      }
    }
  }

  return ''; // Port is not reachable on any of the given hosts.
}

/**
 * Converts an internal URL to an externally reachable URL.
 * @param internalUrl The internal URL.
 * @return The externally reachable URL.
 */
export function toExternalUrl(internalUrl: string): string {
  return internalUrl
    ? internalUrl.replace(/\.?\//, `${env.PRODUCTION_HOST_ADDRESS}/`)
    : internalUrl;
}
