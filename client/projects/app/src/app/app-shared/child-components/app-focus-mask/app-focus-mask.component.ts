import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbsoluteLayout } from '@nativescript/core';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-app-focus-mask',
  templateUrl: './app-focus-mask.component.html',
  styleUrls: ['./app-focus-mask.component.scss']
})
export class AppFocusMaskComponent implements FocusableComponent {

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

  constructor(
    private _focusService: AppFocusService
  ) {}

  get focusable(): boolean {
    return this._focusService.isFocusable([this.enabled, this.visible]);
  }

  /**
   * Transfers focus to this focus mask.
   * @return Whether or not focus was successfully applied.
   */
  focus(): boolean {
    if (this.focusable) {
      this._focusService.focus(this, this.absoluteLayoutRef.nativeElement);
      this.onFocus();
    }
    return this.focusable;
  }

  /**
   * Handles focus events on this focus mask element, and emits a focus output if this element is currently focusable.
   * Additonally, emits a focusTap output when focusable.
   */
  onFocus(): void {
    if (this.focusable) {
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
    if (this.focusable) {
      this.focusTap.emit(true);
    }
  }
}
