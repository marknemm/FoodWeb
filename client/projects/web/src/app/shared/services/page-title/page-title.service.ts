import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

  title = '';

  private _previousRoute = '';

  constructor(router: Router) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const route: string = event.url.split(/[#?]/)[0];
        // Skip route changes that only impact route fragment or query parameters.
        if (route !== this._previousRoute) {
          this._previousRoute = route;
          const preProcessedRoute: string = this._preprocessRoute(route);
          this.title = this._deriveDefaultTitle(preProcessedRoute);
        }
      }
    });
  }

  private _preprocessRoute(route: string): string {
    const routeSplits: string[] = route.split('/');
    this._preProcessRouteIfList(routeSplits);
    this._preProcessRouteIfMy(routeSplits);
    return routeSplits.join('/');
  }

  private _preProcessRouteIfList(routeSplits: string[]): void {
    const listIdx: number = routeSplits.indexOf('list');
    if (listIdx >= 0) {
      routeSplits.splice(listIdx, 1);
      (routeSplits[0])
        ? routeSplits[0] = this._makePlural(routeSplits[0])
        : routeSplits[1] = this._makePlural(routeSplits[1]);
    }
  }

  private _makePlural(word: string): string {
    if (word) {
      if (word.lastIndexOf('y') === word.length - 1) {
        word = `${word.slice(0, word.length - 1)}ies`;
      } else if (word.lastIndexOf('s') === word.length - 1) {
        word = `${word.slice(0, word.length - 1)}es`;
      } else {
        word = `${word}s`;
      }
    }
    return word;
  }

  private _preProcessRouteIfMy(routeSplits: string[]): void {
    const myIdx: number = routeSplits.indexOf('my');
    if (myIdx >= 0) {
      routeSplits.splice(myIdx, 1);
      routeSplits.unshift('my');
    }
  }

  private _deriveDefaultTitle(route: string): string {
    let titleFrags: string[] = route.split(/[\/|\-|_]/);
    titleFrags = titleFrags.filter(
      (word: string) => !/^\d+$/.test(word)
    ).map(
      (word: string) => word.substr(0, 1).toUpperCase() + word.substr(1)
    );
    const title: string = titleFrags.join(' ').trim();
    return (title.length === 0 ? 'Home' : title);
  }
}
