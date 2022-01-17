import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

/**
 * Initializes Deep/Universal Link functionality/handling.
 */
@Injectable({
  providedIn: 'root'
})
export class DeepLinksService {

  constructor(
    private _ngZone: NgZone,
    private _router: Router
  ) {}

  /**
   * Initializes a deep link listener that navigates to an app page when the app is opened via iOS Universal Links or Android Deep Links.
   */
  init(): void {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this._ngZone.run(() => {
        console.log(`Received deep link URL: ${event.url}`);
        if (event.url) {
          this._navigate(new URL(event.url));
        }
      });
    });
  }

  /**
   * Navigates to a page within the app based off of a given deep link URL.
   * @param url The URL object containing deep link navigation data.
   */
  private _navigate(url: URL): void {
    this._router.navigate([url.pathname], {
      fragment: url.hash,
      queryParams: Object.fromEntries(url.searchParams.entries())
    });
  }
}
