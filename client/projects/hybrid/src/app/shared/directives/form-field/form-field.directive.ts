import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormHelperService } from '~web/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formField]',
  providers: [FormHelperService]
})
export class FormFieldDirective implements OnChanges, OnDestroy {

  @Input() formField: AbstractControl | string;
  @Input() error: boolean | string;
  @Input() errorMsg = '';
  @Input() omitErrorMargin = false;

  @HostBinding()
  class = '';

  element: HostElement;

  private _abstractControl: AbstractControl;
  private _formError: HTMLDivElement;
  private _initColors = new Map<any, string>();
  private _destory$ = new Subject();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _formHelperService: FormHelperService,
    elementRef: ElementRef,
  ) {
    this.element = elementRef.nativeElement;
    this.element.classList.add('ion-form-item');
  }

  /**
   * The invalid state of this form field (gives priority to error input binding over abstract control invalid status).
   */
  get invalid(): boolean {
    return !!this.error || (
      this._abstractControl?.invalid
      && (this._abstractControl?.touched || this._abstractControl?.dirty || this._abstractControl?.value)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formField) {
      this._refreshAbstractControl();
    }

    if (changes.error) {
      this._refreshValidation();
    }

    if (changes.omitErrorMargin) {
      this.omitErrorMargin
        ? this.element.classList.add('omit-error-margin')
        : this.element.classList.remove('omit-error-margin');
    }

    if (changes.errorMsg) {
      this._refreshErrorMsg();
    }
  }

  ngOnDestroy(): void {
    this._destory$.next(); // Cleanup any RxJS subscriptions.
  }

  private _refreshAbstractControl(): void {
    this._abstractControl = (typeof this.formField === 'string')
      ? this._formHelperService.deriveAbstractControl(this.formField, null)
      : this._formHelperService.deriveAbstractControl('', this.formField);

    this._destory$.next(); // Cleanup any previous subscriptions.
    if (this._abstractControl) {
      this._refreshValidation();
      this._abstractControl.statusChanges.pipe(takeUntil(this._destory$)).subscribe(
        () => this._refreshValidation()
      );
      this._formHelperService.onMarkAsTouched(this._abstractControl, () => this._refreshValidation());
      this._formHelperService.onMarkAsUntouched(this._abstractControl, () => this._refreshValidation());
    }
  }

  private _refreshValidation(): void {
    // If not an ion-item, then set the color of the host directly, otherwise set color of children.
    if (this.element.tagName !== 'ION-ITEM') {
      this._setElementColor(this.element);
    } else {
      for (let i = 0; i < this.element.children.length; i++) {
        this._setElementColor(<HostElement>this.element.children[i]);
      }
    }

    // Update the presence of any bound error message based off of the current validation/error state.
    this._refreshErrorMsg();
  }

  private _setElementColor(element: HostElement): void {
    if (!this._initColors.has(element)) {
      this._initColors.set(element, element.color);
    }

    element.color = (this.invalid)
      ? 'danger'
      : this._initColors.get(element);
  }

  private _refreshErrorMsg(): void {
    if (typeof this.error === 'string' && !this.errorMsg) {
      this.errorMsg = this.error;
    }

    if (!this._formError && this.errorMsg) {
      this._formError = this._document.createElement('div');
      this._formError.classList.add('ion-form-error');
      (this.element.parentElement.lastElementChild === this.element)
        ? this.element.parentElement.appendChild(this._formError)
        : this.element.parentElement.insertBefore(this._formError, this.element.nextElementSibling);
    }

    if (this._formError) {
      this._formError.textContent = this.errorMsg;
      this._formError.style.display = (this.invalid)
        ? 'block'
        : 'none';
    }
  }

}

export type HostElement = HTMLElement & { color?: string };
