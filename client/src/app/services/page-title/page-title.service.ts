import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Injectable()
export class PageTitleService {

  title: string;

  constructor(
    router: Router,
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          // Add special URL to Title conversion(s) here.
          default:
            this.title = this._deriveDefaultTitle(event.url);
        }
      }
    });
  }

  private _deriveDefaultTitle(url: string): string {
    url = url.replace(/\?(.*)/, '');
    let titleFrags: string[] = url.split(/[\/|\-|_]/);
    titleFrags = titleFrags.map(
      (word: string) => word.substr(0, 1).toUpperCase() + word.substr(1)
    );
    const title: string = titleFrags.join(' ').trim();
    return (title.length === 0 ? 'Home' : title);
  }
}
