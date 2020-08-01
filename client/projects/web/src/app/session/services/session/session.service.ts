import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, AccountHelper } from '~shared';
import { AlertService } from '~web/shared/services/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/services/error-handler/error-handler.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  protected _sessionCache = new Map<string, any>();
  protected _sessionSaveMonitors = new Map<string, Subject<any>>();
  protected _sessionDeleteMonitors = new Map<string, Subject<any>>();

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertService: AlertService,
    protected _errorHandlerService: ErrorHandlerService,
    protected _httpClient: HttpClient
  ) {}

  /**
   * The current user's account. null if the user is not logged in.
   */
  get account(): Account {
    return this.get('account');
  }

  /**
   * The ID of the current user's account. undefined if the user is not logged in.
   */
  get accountId(): number {
    return (this.account ? this.account.id : undefined);
  }

  /**
   * The name of the user account.
   */
  get accountName(): string {
    return this.get('accountName');
  }

  /**
   * Whether or not the user is a donor.
   */
  get isDonor(): boolean {
    return this._accountHelper.isDonor(this.account);
  }

  /**
   * Whether or not the user is a receiver.
   */
  get isReceiver(): boolean {
    return this._accountHelper.isReceiver(this.account);
  }

  /**
   * Whether or not the user is a volunteer.
   */
  get isVolunteer(): boolean {
    return this._accountHelper.isVolunteer(this.account);
  }

  /**
   * Whether or not the user is logged in.
   */
  get loggedIn(): boolean {
    return (this.account != null);
  }

  /**
   * Gets session data from the cache if it is present, or loads it from persistent storage if it is not in the cache.
   * @param key The key of the data to retreive.
   * @return The retrieved data.
   */
  get(key: string): any {
    return this._sessionCache.get(key) || this.load(key);
  }

  /**
   * Loads session data directly from persistent storage and writes it to the cache.
   * @param key The key of the data to load.
   * @param noCacheWrite Set to true if the loaded data should not be written to the cache.
   * @return The loaded data.
   */
  load(key: string, noCacheWrite = false): any {
    const jsonData: string = localStorage.getItem(key);
    if (!jsonData) { return null; }

    const data: any = JSON.parse(jsonData);
    if (!noCacheWrite) {
      this._sessionCache.set(key, data);
    }
    return data;
  }

  /**
   * Saves session data to persistent storage and a cache.
   * @param key The key of the data to save.
   * @param data The data to save.
   * @param noCacheWrite Optionally set to try if the data should not be cached.
   */
  save(key: string, data: any, noCacheWrite = false): void {
    const jsonData: string = JSON.stringify(data);
    localStorage.setItem(key, jsonData);

    if (!noCacheWrite) {
      this._sessionCache.set(key, data);
    }
    this._sessionSaveMonitors.get(key)?.next(data);
  }

  /**
   * Deletes session data from persistent storage and the cache.
   */
  delete(key: string): void {
    const data = this.get(key);
    if (data) {
      localStorage.removeItem(key);
      this._sessionCache.delete(key);
      this._sessionDeleteMonitors.get(key)?.next(data);
    }
  }

  /**
   * Registers a save monitor for a given key that will emit once an associated value is saved.
   * @param key The key to monitor.
   * @param destroy$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a saved value once a save is detected.
   */
  onSave(key: string, destroy$ = new Observable<any>()): Observable<any> {
    if (!this._sessionSaveMonitors.has(key)) {
      this._sessionSaveMonitors.set(key, new Subject<any>());
    }
    return this._sessionSaveMonitors.get(key).asObservable().pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Registers a delete monitor for a given key that will emit once the session entry is deleted.
   * @param key The key to monitor.
   * @param destroy$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a deleted value once a delete is detected.
   */
  onDelete(key: string, destroy$ = new Observable<any>()): Observable<any> {
    if (!this._sessionDeleteMonitors.has(key)) {
      this._sessionDeleteMonitors.set(key, new Subject<any>());
    }
    return this._sessionDeleteMonitors.get(key).asObservable().pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Saves account session data on the client.
   * @param account The account to save.
   */
  saveAccount(account: Account): void {
    this.save('account', account);
    this.save('accountName', this._accountHelper.accountName(account));
  }

  /**
   * Deletes account session data held on the client.
   */
  deleteAccount(): void {
    this.delete('account');
    this.delete('accountName');
  }

  /**
   * Registers an account save monitor that emits a newly saved account (session) upon save.
   * @param destory$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a newly saved account upon save.
   */
  onAccountSave(destory$?: Observable<any>): Observable<Account> {
    return this.onSave('account', destory$);
  }

  /**
   * Registers an account delete monitor that emits a deleted saved account (session) upon delete.
   * @param destory$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a deleted account upon delete.
   */
  onAccountDelete(destroy$?: Observable<any>): Observable<Account> {
    return this.onDelete('account', destroy$);
  }

  /**
   * Checks if an account is owned by the current user.
   * @param accountId The ID of the account to check.
   * @return true if the account is owned by the current user, false if not.
   */
  hasAccountOwnership(accountId: number): boolean {
    return this._accountHelper.doesAccountIdMatch(this.account, accountId);
  }
}
