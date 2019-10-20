import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SplashscreenService {

  private _splashscreen = navigator['splashscreen']

  constructor() {}

  show(): void {
    if (this._splashscreen) {
      this._splashscreen.show();
    }
  }

  hide(): void {
    if (this._splashscreen) {
      setTimeout(() => this._splashscreen.hide());
    }
  }
}
