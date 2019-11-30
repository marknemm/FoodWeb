import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AccountType } from '~shared';

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
        if (route === '/account/list') {
          const accountType = <AccountType>activatedRoute.snapshot.queryParamMap.get('accountType');
          this.title = (accountType ? `${accountType}s` : this._deriveDefaultTitle(route));
        } else if (route.indexOf('/account/details') >= 0) {
          this.title = 'Account';
        } else if (route.indexOf('/account/my') >= 0) {
          this.title = 'My Account';
        } else if (route.indexOf('/donor/donate') >= 0) {
          this.title = 'Donate';
        } else if (route.indexOf('/donation/details') >= 0) {
          this.title = 'Donation';
        } else if (route.indexOf('/donation/list/my') >= 0) {
          this.title = 'My Donations';
        } else if (route.indexOf('/delivery/list/my') >= 0) {
          this.title = 'My Deliveries';
        } else if (route.indexOf('/donation/list') >= 0) {
          this.title = 'Donations';
        } else if (route.indexOf('/delivery/list') >= 0) {
          this.title = 'Deliveries';
        } else if (route.indexOf('/notification/list/my') >= 0) {
          this.title = 'Notifications';
        } else if (route.indexOf('/signup/') >= 0) {
          this.title = 'Signup';
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
