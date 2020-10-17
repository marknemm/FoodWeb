import { Directive, ElementRef, Input } from '@angular/core';
import { ProxyViewContainer } from '@nativescript/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[foodwebAppVisibile]'
})
export class AppVisibleDirective {

  constructor(
    private _elementRef: ElementRef<ProxyViewContainer>
  ) {}

  @Input('foodwebAppVisibile') set visible(visible: VisibleInput) {
    const nativeElement: ProxyViewContainer = this._elementRef.nativeElement;

    if (visible === 'hidden') {
      nativeElement.visibility = 'hidden';
    } else if (visible == null || (visible && visible !== 'collapse' && visible !== 'false')) {
      nativeElement.visibility = 'visible';
    } else {
      nativeElement.visibility = 'collapse';
    }
  }

}
