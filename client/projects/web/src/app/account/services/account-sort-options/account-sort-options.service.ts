import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSortBy, AccountType } from '~shared';
import { SortOption } from '~web/page-list/interfaces/sort-by-opt';

@Injectable()
export class AccountSortOptionsService implements OnDestroy {

  /**
   * Options for sorting dropdown.
   */
  private readonly _options: SortOption<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  private readonly _destroy$ = new Subject();

  constructor(activatedRoute: ActivatedRoute) {
    this.refresh(activatedRoute.snapshot.paramMap.get('accountType') as AccountType);
    activatedRoute.queryParamMap.subscribe((queryPrams: ParamMap) =>
      this.refresh(queryPrams.get('accountType') as AccountType)
    );
  }

  /**
   * The {@link SortOption} list with each element of type {@link AccountSortBy}.
   */
  get options(): readonly SortOption<AccountSortBy>[] {
    return this._options;
  }

  /**
   * Listens for {@link AccountType} value changes emitted by a given observable, and updates sort options on each emission.
   * @param valueChanges The value changes observable to listen to (subscription is internally cleaned up).
   */
  listenAccountTypeChanges(valueChanges: Observable<AccountType>): void {
    valueChanges.pipe(takeUntil(this._destroy$)).subscribe(
      (accountType: AccountType) => this.refresh(accountType)
    );
  }

  /**
   * Refreshes the contained sort by options based on the current account type that is being filtered on via URL query param.
   * @param accountType The current {@link AccountType} query param filter value.
   */
  refresh(accountType: AccountType): void {
    this._options[0].name = accountType
      ? (accountType !== AccountType.Volunteer ? 'Organization Name' : 'Volunteer Name')
      : 'Organization/Volunteer Name';
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
