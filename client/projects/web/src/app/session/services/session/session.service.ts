import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account, AccountHelper } from '~shared';
import { SessionStore, SESSION_STORE_ID } from '~web/session/interfaces/session-store';
import { KeyValueStoreService, PropertyStore } from '~web/shared/services/key-value-store/key-value-store.service';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  protected _sessionDeleteMonitors = new Map<string, Subject<any>>();
  protected _sessionSaveMonitors = new Map<string, Subject<any>>();

  constructor(
    protected _accountHelper: AccountHelper,
    protected _keyValueStoreService: KeyValueStoreService
  ) {}

  /**
   * The current user's account. null if the user is not logged in.
   */
  get account(): Account {
    return this.sessionStore.snapshot.account;
  }

  /**
   * Gets the key-value store associated with the currently logged in Account.
   * If no user is logged in, then the universal 'null' account store will be returned.
   */
  get sessionStore(): PropertyStore<SessionStore> {
    return this._keyValueStoreService.getPropertyStore<SessionStore>(SESSION_STORE_ID)
  }

  /**
   * The email of the current user's account. An empty string if the user is not logged in.
   */
  get accountEmail(): string {
    return (this.account?.contactInfo.email ?? '');
  }

  /**
   * The profile image of the current user's account.
   * If the user is logged in, will either be a URL for the explicitly set profile image,
   * or a single letter to act as profile image placeholder.
   * An empty string if the user is not logged in.
   */
  get accountProfileImg(): string {
    return (this.account?.profileImg ?? '');
  }

  /**
   * The ID of the current user's account. null/undefined if the user is not logged in.
   */
  get accountId(): number {
    return this.account?.id;
  }

  /**
   * The name of the user account.
   */
  get accountName(): string {
    return this._accountHelper.accountName(this.account);
  }

  /**
   * Whether or not the user is a business (donor/receiver).
   */
  get isBusiness(): boolean {
    return (this.isDonor || this.isReceiver);
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

  loadLocalSession(): Observable<SessionStore> {
    return from(
      Promise.all([
        this.sessionStore.get('account'),
        this.sessionStore.get('perpetualSession'),
      ]).then(() => this.sessionStore.snapshot)
    );
  }

  /**
   * Saves account session data on the client.
   * @param account The account to save.
   */
  saveSession(account: Account): void {
    this.sessionStore.set('account', account);
  }

  /**
   * Deletes account session data held on the client.
   */
  clearSession(): void {
    this.sessionStore.clear();
  }

  /**
   * Registers an account save monitor that emits a newly saved account (session) upon save.
   * @param destroy$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a newly saved account upon save.
   */
  onAccountSave(destroy$?: Observable<any>): Observable<Account> {
    return this.onSave('account', destroy$);
  }

  /**
   * Registers an account delete monitor that emits a deleted saved account (session) upon delete.
   * @param destroy$ An optional observable that may be used to unsubscribe from the return observable.
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

  /**
   * Registers a save monitor for a given key that will emit once an associated value is saved.
   * @param key The key to monitor.
   * @param destroy$ An optional observable that may be used to unsubscribe from the return observable.
   * @return An observable that emits a saved value once a save is detected.
   */
  onSave<K extends keyof SessionStore>(key: K, destroy$ = new Observable<any>()): Observable<SessionStore[K]> {
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
  onDelete<K extends keyof SessionStore>(key: K, destroy$ = new Observable<any>()): Observable<SessionStore[K]> {
    if (!this._sessionDeleteMonitors.has(key)) {
      this._sessionDeleteMonitors.set(key, new Subject<any>());
    }
    return this._sessionDeleteMonitors.get(key).asObservable().pipe(
      takeUntil(destroy$)
    );
  }
}
