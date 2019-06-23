import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AccountType } from '../../../../../shared/src/interfaces/account/account';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

  title: string;

  constructor(
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        const route: string = event.url.split(/[#?]/)[0];
        if (route === '/accounts') {
          const accountType = <AccountType>activatedRoute.snapshot.queryParamMap.get('accountType');
          this.title = (accountType ? `${accountType}s` : this._deriveDefaultTitle(route));
        } else if (route.indexOf('/account-details') >= 0) {
          this.title = 'Account';
        } else if (route.indexOf('/donation-details') >= 0) {
          this.title = 'Donation';
        } else if (route.indexOf('/donations/my') >= 0) {
          this.title = 'My Donations';
        } else if (route.indexOf('/deliveries/my') >= 0) {
          this.title = 'My Deliveries';
        } else {
          this.title = this._deriveDefaultTitle(route);
        }
      }
    });
  }

  private _deriveDefaultTitle(route: string): string {
    let titleFrags: string[] = route.split(/[\/|\-|_]/);
    titleFrags = titleFrags.map(
      (word: string) => word.substr(0, 1).toUpperCase() + word.substr(1)
    );
    const title: string = titleFrags.join(' ').trim();
    return (title.length === 0 ? 'Home' : title);
  }
}
