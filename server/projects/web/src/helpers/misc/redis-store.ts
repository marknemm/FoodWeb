import redis = require('redis');
import { RedisClient } from 'redis';
import { promisify } from 'util';

/**
 * A simple Redis key-value store interface.
 */
export class RedisStore {

  private static _storeInstance: RedisStore = new RedisStore();

  /**
   * A singleton instance of a raw redis client.
   * Should generally be avoided in preference of 'store'. Exposed for the sake of flexibility.
   */
  readonly client: RedisClient = redis.createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
  });

  /**
   * A singleton instance of a redis store.
   */
  static getStore(): RedisStore {
    return RedisStore._storeInstance;
  }

  /**
   * External code must use static methods to get/create an instance of RedisStore.
   */
  private constructor() {}

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
