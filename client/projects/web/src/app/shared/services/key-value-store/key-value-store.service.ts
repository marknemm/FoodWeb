import { Injectable } from '@angular/core';
import * as lscache from 'lscache';

/**
 * A service for accessing a key-value store from the user's browser.
 */
@Injectable({
  providedIn: 'root'
})
export class KeyValueStoreService {

  protected readonly _stores = new Map<string, KeyValueStore>();

  /**
   * Gets a property (key-value) storage bucket via a given store ID.
   * @param storeId The optional store ID used to access the associated storage bucket.
   * @return The property (key-value) storage bucket.
   */
  getPropertyStore<T>(storeId = '', snapshotDisabled = false): PropertyStore<T> {
    return this.getStore(storeId, snapshotDisabled);
  }

  /**
   * Gets a key-value storage bucket via a given store ID.
   * @param storeId The optional store ID used to access the associated storage bucket.
   * @return The key-value storage bucket.
   */
  getStore<K, V>(storeId = '', snapshotDisabled = false): KeyValueStore<K, V> {
    const store: KeyValueStore<K, V> = this._stores.has(storeId)
      ? this._stores.get(storeId)
      : this._createKeyValueStore(storeId, snapshotDisabled);
    store.snapshotDisabled = snapshotDisabled;
    this._stores.set(storeId, store);
    return store;
  }

  /**
   * Creates a new key-value store with a unique ID.
   * @param storeId The ID of the new store to create.
   * @param snapshotDisabled Whether or not the in-memory snapshot is disabled for the store.
   * @returns The new key-value store.
   */
  protected _createKeyValueStore<K, V>(storeId: string, snapshotDisabled: boolean): KeyValueStore<K, V> {
    return new KeyValueStore<K, V>(storeId, snapshotDisabled);
  }

}

/**
 * A persistent key-value store for locally storing data within the user's browser or device.
 * @param K The type of the key.
 * @param V The type of the value.
 */
export class KeyValueStore<K = any, V = any> {

  protected _snapshot: { [key: string]: V } = {};

  constructor(
    public readonly bucketId: string,
    private _snapshotDisabled = false
  ) {}

  /**
   * The in-memory snapshot (cache) for the key-value store.
   * Any values that are set/read to/from the saved storage will be cached here, and may be accessed synchronously.
   */
  get snapshot(): any {
    return this._snapshot;
  }

  /**
   * Whether or not the in-memory snapshot (cache) is disabled.
   */
  get snapshotDisabled(): boolean {
    return this._snapshotDisabled;
  }

  set snapshotDisabled(disabled: boolean) {
    if (this._snapshotDisabled !== disabled) {
      this._snapshotDisabled = disabled;
      this._snapshot = {}; // Must clear in-memory snapshot whenever disabled state changes to ensure consistency.
    }
  }

  /**
   * Clears all entries out of the store.
   * @return A promise that resolves once the clear operation completes.
   */
  async clear(): Promise<void> {
    await this._clear();
    this._snapshot = {};
  }

  /**
   * Gets an entry via a given key.
   * @param key The key of the entry to retrieve.
   * @return A promise that resolves to the value of the entry if it exists, otherwise null.
   */
  async get(key: K): Promise<V> {
    let value: V;
    const keyStr = this._keyToString(key);

    if (this.snapshotDisabled || !this.snapshot[keyStr]) {
      value = await this._load(keyStr);
      this.snapshot[keyStr] = value;
    } else {
      value = this.snapshot[keyStr];
    }

    return value;
  }

  /**
   * Determines if an entry with a given key exists.
   * @param key The key of the entry to find.
   * @return A promsie that resolves to true if the entry was found in the store, false if not.
   */
  async has(key: K): Promise<boolean> {
    return (await this.get(key)) != null;
  }

  /**
   * Removes an entry from key-value storage.
   * @param key The key of the entry that is to be removed.
   * @return A promise that resolves to the value of the removed entry; null if it does not exist.
   */
  async remove(key: K): Promise<V> {
    const keyStr: string = this._keyToString(key);
    const value: V = await this._load(keyStr);
    await this._remove(keyStr);
    delete this.snapshot[keyStr];
    return value;
  }

  /**
   * Sets an entry within key-value storage.
   * @param key The key of the entry.
   * @param value The value of the entry.
   * @return A promise that resolves once the operation completes.
   */
  async set(key: K, value: V): Promise<void> {
    const keyStr: string = this._keyToString(key);
    await this._save(keyStr, value);
    if (!this.snapshotDisabled) {
      this.snapshot[keyStr] = value;
    }
  }

  /**
   * Clears all data that has been saved to the persistent storage bucket.
   * @return A promise that resolves once the operation completes.
   */
  protected async _clear(): Promise<void> {
    lscache.setBucket(this.bucketId);
    lscache.flush();
  }

  /**
   * Loads a value from the persistent storage bucket.
   * @param key The key associated with the value to load.
   * @return A promise that resolves to the loaded value.
   */
  protected async _load(key: string): Promise<V> {
    lscache.setBucket(this.bucketId);
    return lscache.get(key);
  }

  /**
   * Removes a value from the persistent storage bucket.
   * @param key The key associated with the value to remove.
   * @return A promise that resolves once the operation completes.
   */
  protected async _remove(key: string): Promise<void> {
    lscache.setBucket(this.bucketId);
    lscache.remove(key);
  }

  /**
   * Saves a value to the persistent storage bucket.
   * @param key The key associated with the value to save.
   * @param value The value to save.
   * @return A promise that resolves once the operation completes.
   */
  protected async _save(key: string, value: V): Promise<void> {
    lscache.setBucket(this.bucketId);
    lscache.set(key, value);
  }

  /**
   * Converts a given store key to a string.
   * @param key The key to convert.
   * @returns The given key in string format.
   */
  private _keyToString(key: any): string {
    return (typeof key !== 'string')
      ? JSON.stringify(key)
      : key;
  }
}

/**
 * A persistent property (key-value) store for locally storing data within the user's browser or device.
 * @param T The type of the object that is to have its properties stored.
 */
export abstract class PropertyStore<T> extends KeyValueStore<keyof T, any> {

  get snapshot(): T {
    return <any>this._snapshot;
  }

  get<K extends keyof T>(key: K): Promise<T[K]> {
    return super.get(key);
  }

  remove<K extends keyof T>(key: K): Promise<T[K]> {
    return super.remove(key);
  }

  set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return super.set(key, value);
  }
}
