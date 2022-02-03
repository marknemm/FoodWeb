import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

/**
 * Facilitates scrolling to an element whose id matches a fragment hash that is present in the browser URL.
 */
@Injectable({
  providedIn: 'root'
})
export class FragmentScrollService {

  constructor(
    private _router: Router
  ) {}

  /**
   * Initializes a fragment scroll listener that will scroll to an element whose id is matched with the fragment hash
   * that is present in the URL whenever there is a change within the URL.
   */
  initUrlListener(): void {
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.triggerScroll();
      }
    });
  }

  /**
   * Triggers a scroll to the element whose id is matched with the fragment hash that is present in the URL.
   */
  triggerScroll(): void {
    const fragment: string = window.location.hash.substring(1); // substring(1) - remove leading '#'.
    if (fragment) {
      document.getElementById(fragment).scrollIntoView();
      if (window.innerWidth <= 767) {
        const mobileHeader = document.getElementsByTagName('header')?.item(0);
        const mobileOffset = (mobileHeader ? mobileHeader.offsetHeight + 5 : 0);
        document.body.scrollBy(0, -mobileOffset); // Account for header overlap in mobile.
      }
    }
  }
}
