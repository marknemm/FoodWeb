import { Directive, ElementRef, Input } from '@angular/core';
import { ProxyViewContainer, Visibility } from '@nativescript/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[foodwebAppVisibile]'
})
export class AppVisibleDirective {

  constructor(
    private _elementRef: ElementRef<ProxyViewContainer>
  ) {}

  @Input('foodwebAppVisibile') set visible(visible: boolean | Visibility) {
    const nativeElement: ProxyViewContainer = this._elementRef.nativeElement;

    if (visible === 'hidden') {
      nativeElement.visibility = 'hidden';
    } else if (visible == null || (visible && visible !== 'collapse')) {
      nativeElement.visibility = 'visible';
    } else {
      nativeElement.visibility = 'collapse';
    }
  }

}
