import { Injectable } from '@angular/core';
import { ApplicationSettings } from '@nativescript/core';
import { AccountHelper } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AppSessionService extends SessionService {

  constructor(
    protected _accountHelper: AccountHelper
  ) {
    super(_accountHelper);
  }

  /**
   * The app's long lived session token used to maintain login over long period of time.
   */
  get appSessionToken(): string {
    return this.get('appSessionToken');
  }

  /**
   * Saves a given app session token on the client.
   * @param token The app session token to save.
   */
  saveAppSessionToken(token: string): void {
    if (token) {
      this.save('appSessionToken', token);
    }
  }

  /**
   * Deletes app session token on the client.
   */
  deleteAppSessionToken(): void {
    this.delete('appSessionToken');
  }

  /**
   * @override
   * Performs the raw (most basic) level of the load operation (interacts directly with native API).
   * @param key The key of the data to load.
   */
  protected _rawLoad(key: string): string {
    return ApplicationSettings.getString(key);
  }

  /**
   * @override
   * Performs the raw (most basic) level of the save operation (interacts directly with native API).
   * @param key The key of the data to save.
   * @param jsonData The JSON/string data to save.
   */
  protected _rawSave(key: string, jsonData: string): void {
    ApplicationSettings.setString(key, jsonData);
  }

  /**
   * @override
   * Performs the raw (most basic) level of the delete operation (interacts directly with native API).
   * @param key The key of the session data to delete.
   */
  protected _rawDelete(key: string): void {
    ApplicationSettings.remove(key);
  }
}
