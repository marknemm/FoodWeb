import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { isAndroid, ViewBase } from '@nativescript/core';
import _ from '~lodash-mixins';

@Directive({
  selector: '[foodwebAppAndroidFocusable]'
})
export class AppAndroidFocusableDirective implements OnInit, OnChanges {

  @Input('foodwebAppAndroidFocusable') focusable: BooleanInput = true;

  private _hostLoaded = false;

  constructor(
    private _elementRef: ElementRef<ViewBase>
  ) {}

  ngOnInit() {
    this._elementRef.nativeElement.on('loaded', () => {
      this._hostLoaded = true;
      this.refreshFocusable();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.focusable) {
      this.refreshFocusable();
    }
  }

  /**
   * Refreshes the focusable status of the host element (on Android devices).
   * @param focusable An optional focusable state to refresh to. Defaults to foodwebAppAndroidFocusable input value assigned in template.
   */
  refreshFocusable(focusable = _.toBoolean(this.focusable)): void {
    this.focusable = focusable;
    if (isAndroid && this._hostLoaded) { // Can only access native Android element after 'loaded' event fired (see ngOnInit).
      this._elementRef.nativeElement.android.setFocusable(focusable);
      this._elementRef.nativeElement.android.setFocusableInTouchMode(focusable);
    }
  }
}
