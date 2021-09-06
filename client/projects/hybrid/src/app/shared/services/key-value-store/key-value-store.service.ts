import { Injectable } from '@angular/core';
import { GetResult, Storage } from '@capacitor/storage';
import { KeyValueStore, KeyValueStoreService as WebKeyValueStoreService } from '~web/shared/services/key-value-store/key-value-store.service';
export { KeyValueStore };

/**
 * A service for accessing a key-value store from the user's device.
 */
@Injectable({
  providedIn: 'root'
})
export class KeyValueStoreService extends WebKeyValueStoreService {

  protected _createKeyValueStore<K, V>(storeId: string): KeyValueStore<K, V> {
    return new CapacitorStore<K, V>(storeId);
  }

}

/**
 * Key-Value store implementation using the Capacitor Storage plugin.
 */
 class CapacitorStore<K, V> extends KeyValueStore<K, V> {

  protected async _clear(): Promise<void> {
    await Storage.configure({ group: this.bucketId });
    await Storage.clear();
  }

  protected async _load(key: string): Promise<V> {
    await Storage.configure({ group: this.bucketId });
    const entry: GetResult = await Storage.get({ key });
    if (typeof entry?.value === 'string') {
      return (entry.value !== 'undefined')
        ? JSON.parse(entry.value)
        : undefined; // JSON.parse throws error when given 'undefined' string.
    }
    return <V>entry.value;
  }

  protected async _remove(key: string): Promise<void> {
    await Storage.configure({ group: this.bucketId });
    await Storage.remove({ key });
  }

  protected async _save(key: string, value: V): Promise<void> {
    await Storage.configure({ group: this.bucketId });
    await Storage.set({ key, value: JSON.stringify(value) });
  }
}
