import { Injectable } from '@angular/core';
import { LocalStorageBucket } from './local-storage-bucket';
export { LocalStorageBucket };

@Injectable({
  providedIn: 'root'
})
export class LocalStorageCacheService {

  private readonly _memCacheBuckets = new Map<string, LocalStorageBucket>();

  constructor() {}

  /**
   * Gets the LocalStorage cache bucket via a given bucket key. If it hasn't been initialized yet, then it is initialized.
   * @param bucketKey The optional LocalStorage bucket key used to access the associated cache within LocalStorage.
   * @param expiryMilliseconds The default number of milliseconds before each entry in the cache should be evicted. Defaults to 60000 (1 min).
   * @param maxMemCacheEntries The maximum number of cache entries that will be stored as original objects in memory. Defaults to 100.
   * @return The LocalStorage cache bucket.
   */
  getBucket<K, V>(bucketKey = '', expiryMilliseconds = 60000, maxMemCacheEntries = 100): LocalStorageBucket<K, V> {
    return (this._memCacheBuckets.has(bucketKey))
      ? this._memCacheBuckets.get(bucketKey)
      : this._initBucket<K, V>(bucketKey, expiryMilliseconds, maxMemCacheEntries);
  }

  /**
   * Initializes a LocalStorage cache bucket.
   * @param bucketKey The bucket key.
   * @param expiryMilliseconds The expiration time for each entry within the bucket.
   * @param maxMemCacheEntries The max number of cache entries that are allowed to be buffered in memory.
   * @return The initialized LocalStorage cache bucket.
   */
  private _initBucket<K, V>(bucketKey: string, expiryMilliseconds: number, maxMemCacheEntries: number): LocalStorageBucket<K, V> {
    const cacheBucket = new LocalStorageBucket<K, V>(bucketKey, expiryMilliseconds, maxMemCacheEntries);
    this._memCacheBuckets.set(bucketKey, cacheBucket);
    return cacheBucket;
  }
}
