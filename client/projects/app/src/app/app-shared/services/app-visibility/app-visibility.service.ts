import { Injectable } from '@angular/core';
import { Visibility } from '@nativescript/core';

@Injectable({
  providedIn: 'root'
})
export class AppVisibilityService {

  constructor() {}

  isVisible(visible: VisibleInput): boolean {
    return (visible == null || (visible && visible !== 'collapse' && visible !== 'hidden' && visible !== 'false'));
  }

  toVisiblity(visible: VisibleInput): Visibility {
    if (this.isVisible(visible)) {
      return 'visible';
    }

    return (visible && visible === 'hidden')
      ? 'hidden'
      : 'collapse';
  }
}
