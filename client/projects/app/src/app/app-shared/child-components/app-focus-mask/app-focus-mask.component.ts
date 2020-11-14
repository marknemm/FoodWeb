import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbsoluteLayout } from '@nativescript/core';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-app-focus-mask',
  templateUrl: './app-focus-mask.component.html',
  styleUrls: ['./app-focus-mask.component.scss']
})
export class AppFocusMaskComponent implements FocusableComponent, OnChanges {

  @Convert()
  @Input() enabled: boolean = true;
  @Input() nextFocus: Focusable;
  @Input() visible: VisibleInput = true;

  @Output() blur = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();
  @Output() tap = new EventEmitter();
  @Output() focusTap = new EventEmitter<boolean>();

  @ViewChild('absoluteLayoutRef', { static: true }) absoluteLayoutRef: ElementRef<AbsoluteLayout>;

  private _preHiddenEnabled: boolean;

  constructor(
    private _focusService: AppFocusService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible) {
      this._syncEnabledStateWithVisible();
    }
  }

  /**
   * Synchronizes the enabled state for this component with its visibility state.
   * Whenever this component is made invisble, then it is also disabled.
   * Whenever it is made visible, it re-instates its original enabled state.
   */
  private _syncEnabledStateWithVisible(): void {
    if (this.visible && this.visible !== 'collapse' && this.visible !== 'hidden' && this.visible !== 'false') {
      this.enabled = (this._preHiddenEnabled != null) ? this._preHiddenEnabled : this.enabled;
    } else {
      this._preHiddenEnabled = this.enabled;
      this.enabled = false;
    }
  }

  /**
   * Transfers focus to this focus mask.
   * @return Whether or not focus was successfully applied.
   */
  focus(): boolean {
    if (this.enabled) {
      this._focusService.focus(this, this.absoluteLayoutRef.nativeElement);
      this.onFocus();
    }
    return this.enabled;
  }

  /**
   * Handles focus events on this focus mask element, and emits a focus output if this element is currently focusable.
   * Additonally, emits a focusTap output when focusable.
   */
  onFocus(): void {
    if (this.enabled) {
      this.focusOutput.emit();
      this.focusTap.emit(false);
    }
  }

  /**
   * Handles tap events on this focus mask element, and emits a tap output.
   * Also, emits a focusTap output if this element is currently focusable.
   */
  onTap(): void {
    this.tap.emit();
    if (this.enabled) {
      this.focusTap.emit(true);
    }
  }
}
