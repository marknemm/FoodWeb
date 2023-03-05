import { Injectable } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  readonly windowSizeThreshPx = 991;

  footerAttributions: string[] = [];
  sticky = false;
  pageTitle = '';

  private _leftNavMode: MatDrawerMode = 'over';
  private _leftNavOpened = false;
  private _leftNavOpenedChanged = new Subject<boolean>();
  private _mainContent: HTMLElement;
  private _previousRoute = '';

  constructor(router: Router) {
    // Initialize route listener.
    router.events.pipe(
      filter((event: Event) => event instanceof NavigationStart),
      map((event: Event) => event as NavigationStart),
    ).subscribe((event: NavigationStart) => this._handleRouteChange(event));
    setTimeout(() => this._handleRouteChange(router)); // Must invoke initially since NavigationStart will be missed on webapp load.
  }

  get leftNavMode(): MatDrawerMode {
    return this._leftNavMode;
  }

  set leftNavMode(mode: MatDrawerMode) {
    this._leftNavMode = mode;
    this.leftNavOpened = (this.leftNavMode === 'side');
  }

  get leftNavOpened(): boolean {
    return this._leftNavOpened;
  }

  set leftNavOpened(open: boolean) {
    this._setLeftNavOpened(open);
  }

  get leftNavOpenedChanged(): Observable<boolean> {
    return this._leftNavOpenedChanged.asObservable();
  }

  setMainContent(mainContent: HTMLElement): void {
    this._mainContent = mainContent;
  }

  toggleLeftNav(): void {
    this._setLeftNavOpened(!this._leftNavOpened);
  }

  protected _setLeftNavOpened(opened: boolean): void {
    this._leftNavOpened = opened;
    this._leftNavOpenedChanged.next(this._leftNavOpened);
  }

  scrollContentToTop(scrollBehavior: ScrollBehavior = 'smooth'): void {
    if (this._mainContent) {
      this._mainContent.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }

  private _handleRouteChange(routeInfo: Router | NavigationStart): void {
    const route: string = routeInfo.url.split(/[#?]/)[0];
    if (route !== this._previousRoute) { // Skip route changes that only impact route fragment or query parameters.
      this._previousRoute = route;
      const preProcessedRoute: string = this._preprocessRoute(route);
      this.pageTitle = this._deriveDefaultPageTitle(preProcessedRoute);
      console.log(this.pageTitle);
      this.footerAttributions = [];
    }
  }

  private _preprocessRoute(route: string): string {
    const routeSplits: string[] = route.split('/');
    this._preProcessRouteIfList(routeSplits);
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
      word = (word.lastIndexOf('y') === word.length - 1)
        ? `${word.slice(0, word.length - 1)}ies`
        : (word.lastIndexOf('s') === word.length - 1)
          ? `${word.slice(0, word.length - 1)}es`
          : `${word}s`;
    }
    return word;
  }

  private _deriveDefaultPageTitle(route: string): string {
    const titleFrags: string[] = route.split('/');
    const title: string = titleFrags.filter(
      (urlFrag: string) => !/^\d+$/.test(urlFrag)
    ).map(
      (urlFrag: string) => urlFrag.split(/[-|_]/)
                                  .map((word: string) => word.substr(0, 1).toUpperCase() + word.substr(1))
                                  .join(' ')
    ).reverse()
     .join(' ')
     .trim();
    return (title !== 'Home')
      ? title.replace(/Details\s*/, '')
      : '';
  }
}
