import { Directive, ElementRef, Input } from '@angular/core';
import { ProxyViewContainer } from '@nativescript/core';
import { AppVisibilityService } from '~app/app-shared/services/app-visibility/app-visibility.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[foodwebAppVisibile]'
})
export class AppVisibleDirective {

  constructor(
    private _elementRef: ElementRef<ProxyViewContainer>,
    private _visibilityService: AppVisibilityService
  ) {}

  @Input('foodwebAppVisibile') set visible(visible: VisibleInput) {
    const nativeElement: ProxyViewContainer = this._elementRef.nativeElement;
    nativeElement.visibility = this._visibilityService.toVisiblity(visible);
  }
}
