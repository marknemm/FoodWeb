import 'dotenv';

/**
 * Converts an internal URL to an externally reachable URL.
 * @param internalUrl The internal URL.
 * @return The externally reachable URL.
 */
export function toExternalUrl(internalUrl: string): string {
  return internalUrl
    ? internalUrl.replace(/\.?\//, `${process.env.PRODUCTION_HOST_ADDRESS}/`)
    : internalUrl;
}
