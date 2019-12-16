import * as lscache from 'lscache';

export class LocalStorageBucket<K = any, V = any> {

  private _memCacheStore = new Map<K, CacheEntry<K, V>>();
  private _expiryOrder: CacheEntry<K, V>[] = [];

  private _expiryMilliseconds: number;
  private _maxMemCacheEntries: number;

  constructor(
    public readonly bucketKey: string,
    expiryMilliseconds: number,
    maxMemCacheEntries: number
  ) {
    lscache.setBucket(bucketKey);
    lscache.flushExpired();
    this.expiryMilliseconds = expiryMilliseconds;
    this.maxMemCacheEntries = maxMemCacheEntries;
  }

  /**
   * The number of milliseconds until the cached entries should expire.
   */
  get expiryMilliseconds(): number {
    return this._expiryMilliseconds;
  }

  set expiryMilliseconds(value: number) {
    const expiryMsDelta: number = (this._expiryMilliseconds - value);
    this._expiryMilliseconds = value;
    lscache.setExpiryMilliseconds(value);
    // Update expiration time in memory cache store based on new expiry milliseconds.
    this._expiryOrder.forEach((entry: CacheEntry<K, V>) => {
      entry.expiresMs += expiryMsDelta;
    });
  }

  /**
   * The maximum number of cached entries that may be buffered in memory.
   */
  get maxMemCacheEntries(): number {
    return this._maxMemCacheEntries;
  }

  set maxMemCacheEntries(value: number) {
    this._maxMemCacheEntries = value;
    if (this._expiryOrder.length > this._maxMemCacheEntries) {
      // Remove excess memory cache store entries (starting from the those with the earliest expiration times).
      const numExcess: number = (this._expiryOrder.length - this._maxMemCacheEntries);
      this._expiryOrder.splice(0, numExcess).forEach((entry: CacheEntry<K, V>) =>
        this._memCacheStore.delete(entry.key)
      );
    }
  }

  /**
   * Adds a new entry to the LocalStorage cache.
   * @param key The key of the new entry.
   * @param value The value of the new entry.
   */
  addItem(key: K, value: V, expiryMilliseconds = this._expiryMilliseconds): void {
    // Eject an entry from the memory cache store if we exceed the configured max number.
    if (this._memCacheStore.size >= this._maxMemCacheEntries) {
      this._removeMemCacheItem();
    }
    const entry: CacheEntry<K, V> = this._genCacheEntry(key, value, expiryMilliseconds);
    lscache.set(JSON.stringify(key), entry, expiryMilliseconds);
    this._addEntryToMemCache(entry);
  }

  /**
   * Generates a cache entry with a given value and expiry time.
   * @param value The value of the cache entry.
   * @param expiryMilliseconds The number of milliseconds until the entry should expire.
   * @return The generated cache entry.
   */
  private _genCacheEntry(key: K, value: V, expiryMilliseconds: number): CacheEntry<K, V> {
    const nowMs = (new Date()).getMilliseconds();
    return {
      expiresMs: (nowMs + expiryMilliseconds),
      key,
      value
    };
  }

  /**
   * Adds an entry to the memory cache store.
   * @param entry The entry to add to the memory cache store.
   */
  private _addEntryToMemCache(entry: CacheEntry<K, V>): void {
    this._memCacheStore.set(entry.key, entry);
    this._addEntryToOrderedExpiryList(entry);
  }

  /**
   * Adds an entry to the ordered expiry list.
   * @param entry The entry to add to the ordered expiry list.
   */
  private _addEntryToOrderedExpiryList(entry: CacheEntry<K, V>): void {
    const insertIdx: number = this._findInsertIdx(entry);
    this._expiryOrder.splice(insertIdx, 0, entry);
  }

  /**
   * Finds the index at which to insert the given entry.
   * NOTE: If the entry has already been inserted, then its index will be returned.
   * @param entry The entry that is to be inserted.
   * @return The (0 based) insert index.
   */
  private _findInsertIdx(entry: CacheEntry<K, V>): number {
    let lowIdx = 0;
    let highIdx: number = this._expiryOrder.length;
    do {
      const midIdx: number = Math.floor((lowIdx + highIdx) / 2);
      // Return immediately if we found entry with equivalent expireMs.
      if (entry.expiresMs === this._expiryOrder[midIdx].expiresMs) {
        return midIdx;
      }
      (entry.expiresMs > this._expiryOrder[midIdx].expiresMs)
        ? lowIdx = (midIdx + 1)
        : highIdx = (midIdx - 1);
    } while (lowIdx < highIdx);
    return lowIdx;
  }

  /**
   * Flushes all elements out of the cache.
   */
  flush(): void {
    lscache.flush();
    this._memCacheStore.clear();
    this._expiryOrder.splice(0, this._expiryOrder.length);
  }

  /**
   * Flushes all expired elements out of the cache.
   */
  flushExpired(): void {
    lscache.flushExpired();
    const cutOffEntry: CacheEntry<K, V> = this._genCacheEntry(null, null, 0); // A dummy entry that expires now.
    const cutOffIdx: number = this._findInsertIdx(cutOffEntry); // Remove elements up to cut-off index.
    this._expiryOrder.splice(0, cutOffIdx).forEach((entry: CacheEntry<K, V>) =>
      this._memCacheStore.delete(entry.key)
    );
  }

  /**
   * Gets a cached item via a given key.
   * @param key The key of the cached item to retrieve.
   * @return The item if it exists, otherwise null.
   */
  getItem(key: K): V {
    return this._memCacheStore.has(key)
      ? this._memCacheStore.get(key).value
      : lscache.get(JSON.stringify(key));
  }

  /**
   * Gets an item that has been saved to LocalStorage (bucket) via a given key.
   * @param key The key of the item to retrieve.
   * @return The item; null if the item does not exist.
   */
  private _getSavedItem(key: K): V {
    const entry: CacheEntry<K, V> = lscache.get(JSON.stringify(key));
    // if we are retrieving an item that doesn't exist in the in-memory cache, than copy it to it.
    if (entry && !this._memCacheStore.has(key)) {
      this._addEntryToMemCache(entry);
    }
    return entry ? entry.value : null;
  }

  /**
   * Determines if an item is cached.
   * @param key The key of the item to find.
   * @return true if the item was found in the cache, false if not.
   */
  hasItem(key: K): boolean {
    // NOTE: This will copy the item to the in-memory cache if it does not exist there.
    return (this._memCacheStore.has(key) || this._getSavedItem(key) != null)
  }

  /**
   * Removes a cache item.
   * @param key The key of the cache item that is to be removed.
   * @return The removed cache item; null if no such item was cached.
   */
  removeItem(key: K): V {
    const keyJson: string = JSON.stringify(key);
    const value: V = lscache.get(keyJson).value;
    this._removeMemCacheItem(key);
    lscache.remove(keyJson);
    return value;
  }

  /**
   * Removes an item from the memory cache.
   * @param key The key of the item to remove.
   * If no key is given, then the item with the earliest expiry time is removed.
   * @return The value of the removed item.
   */
  private _removeMemCacheItem(key: K = this._getKeyOfEntryToEject()): V {
    if (key && this._memCacheStore.has(key)) {
      const entry: CacheEntry<K, V> = this._memCacheStore.get(key);
      this._memCacheStore.delete(key);
      this._removeEntryFromOrderedExpiryList(entry);
      return entry.value;
    }
    return null;
  }

  /**
   * Gets the key of the next entry that should be ejected from the memory cache.
   * @return The key of the next entry to eject; null if there are no entries in the memory cache.
   */
  private _getKeyOfEntryToEject(): K {
    const nextExpireEntry: CacheEntry<K, V> = this._expiryOrder[0];
    return (nextExpireEntry)
      ? nextExpireEntry.key
      : null;
  }

  /**
   * Removes an entry from the ordered expiry list.
   * @param entry The entry to remove from the ordered expiry list.
   */
  private _removeEntryFromOrderedExpiryList(entry: CacheEntry<K, V>): void {
    const entryIdx: number = this._findInsertIdx(entry);
    this._expiryOrder.splice(entryIdx, 1);
  }
}

/**
 * A cache entry.
 */
interface CacheEntry<K, V> {
  expiresMs: number;
  key: K;
  value: V;
}
