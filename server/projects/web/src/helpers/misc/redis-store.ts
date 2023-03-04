import redis = require('redis');
import { RedisClient, RetryStrategyOptions } from 'redis';
import { promisify } from 'util';
import { getPort, getReachableUrl } from '~web/helpers/misc/url';
import { env } from '../globals/env';

/**
 * A simple Redis key-value store interface.
 */
export class RedisStore {

  /**
   * The singleton instance of this RedisStore.
   */
  private static _instance: RedisStore;

  /**
   * The raw redis client.
   */
  private _client: RedisClient;

  /**
   * A singleton instance of a redis store.
   */
  static async getInstance(): Promise<RedisStore> {
    if (!RedisStore._instance) {
      RedisStore._instance = new RedisStore();
      await RedisStore._instance._init();
    }
    return RedisStore._instance;
  }

  /**
   * Private constructor to enforce singleton instance.
   */
  private constructor() {}

  /**
   * The raw Redis client. Exposed for flexibility, but should generally use the `del`, `get`, and `set`
   * methods within this wrapper class instead of this raw client.
   */
  get client(): RedisClient {
    return this._client;
  }

  /**
   * Initializes the RedisStore.
   */
  private async _init() {
    this._client = redis.createClient({
      url: await this.getUrl(),
      password: env.REDIS_PASSWORD,
      retry_strategy: (retryOpts: RetryStrategyOptions) => {
        if (retryOpts.error && retryOpts.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (retryOpts.attempt > 10) {
          return undefined;
        }
        return (retryOpts.attempt * 200); // Max out during attempt 10 at 2000ms.
      }
    });
  }

  /**
   * Gets the redis URL.
   * @return A promise that resolves to the redis URL.
   */
  private async getUrl(): Promise<string> {
    if (env.REDIS_TLS_URL) { // Have full (prod) URL configured with TLS built-in.
      return env.REDIS_TLS_URL;
    }

    // Check for a reachable redis host. First check the configured environment variable for the URL, then check common dev URLs.
    const redisHosts: string[] = [env.REDIS_URL, 'localhost', 'redis'];
    const redisPort: number = getPort(env.REDIS_URL, 6379);
    const redisHost: string = await getReachableUrl(redisHosts, redisPort);
    const redisProtocol: string = (env.REDIS_SSL || env.PRODUCTION)
      ? 'rediss://'
      : 'redis://';
    return `${redisProtocol}${redisHost}:${redisPort}`;
  }

  /**
   * Deletes an entry from this Redis key-value store.
   * @param key The key of the entry that is to be deleted.
   * @return A promise that resolves once the delete operation completes.
   */
  del(key: string): Promise<void> {
    return new Promise<void>((resolve) =>
      this.client.del(key, () => resolve())
    );
  }

  /**
   * Gets a value from this Redis key-value store.
   * @param key The key of the value that is to be retrieved.
   * @return A promise that resolves to the (deserialized) value.
   */
  get(key: string): Promise<any> {
    const getPromise: Promise<string> = promisify(this.client.get).bind(this.client)(key);
    return getPromise.then(
      (value: string) => JSON.parse(value)
    );
  }

  /**
   * Sets a value within this Redis key-value store.
   * Overwrites values that have previously been set.
   * @param key The key of the value that is to be set.
   * @param value The value that is to be JSON serialized & set.
   * @return A promise that resolves to 'OK' on success.
   */
  set(key: string, value: any): Promise<'OK'> {
    const serializedValue: string = JSON.stringify(value);
    return <Promise<'OK'>> promisify(this.client.set).bind(this.client)(key, serializedValue);
  }
}

/**
 * Generates/gets a singleton instance of the RedisStore.
 * @return A promise that resolves to the RedisStore.
 */
export async function getRedisStore(): Promise<RedisStore> {
  return await RedisStore.getInstance();
}
