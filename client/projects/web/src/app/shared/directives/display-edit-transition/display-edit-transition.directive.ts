import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Applies a smooth transition to the resize of the host container element based off of the size of contained
 * form and readonly-display elements, and an editable state.
 */
@Directive({
  selector: '[foodwebDisplayEditTransition]',
  exportAs: 'editDisplayTransition'
})
export class DisplayEditTransitionDirective implements OnInit, OnChanges, OnDestroy {

  @Input('foodwebDisplayEditTransition') editable = false;
  @Input() display: HTMLElement;
  @Input() duration = 0.25;
  @Input() form: HTMLElement;

  readonly container: HTMLElement;

  private _destroy$ = new Subject<void>();
  private _resizeObserver = new ResizeObserver(() => this._recalcContainerHeight());

  constructor(elementRef: ElementRef) {
    this.container = elementRef.nativeElement;
  }

  ngOnInit() {
    // Ensure all required inputs have been bound.
    if (!this.display) {
      throw new Error(`'display' input property is required for foodwebDisplayEditTransition directive on: ${this.container.innerHTML}`);
    }
    if (!this.form) {
      throw new Error(`'form' input property is required for foodwebDisplayEditTransition directive on: ${this.container.innerHTML}`);
    }

    this._initTransitionStyles();
  }

  private _initTransitionStyles(): void {
    const containerStyles: CSSStyleDeclaration = this.container.style;
    containerStyles.transition = `height ${this.duration}s ease-in-out`;
    this.form.style.transition = `opacity ${this.duration}s ease-in-out`;
    this.display.style.transition = `opacity ${this.duration}s ease-in-out`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // On any change to editable state or contained form/readonly-display elements, refresh styles and observers.
    if (changes.editable || changes.form || changes.display) {
      this._resizeObserver.disconnect();
      this.recalcStyles();
      this._resizeObserver.observe(
        (this.editable ? this.form : this.display)
      );
    }
  }

  /**
   * Recalculates the display/opacity (visibility) styles and the height for the host container element.
   */
  recalcStyles(): void {
    const initContainerOverflow = this.container.style.overflow;
    this.container.style.overflow = 'hidden';
    setTimeout(() => this.container.style.overflow = initContainerOverflow, this.duration * 1000);
    this._recalcVisibilityStylesFor(this.form.style, this.editable);
    this._recalcVisibilityStylesFor(this.display.style, !this.editable);
    setTimeout(() => this._recalcContainerHeight());
  }

  private _recalcContainerHeight(): void {
    const containerHeight: number = (this.editable)
      ? this.form.offsetHeight
      : this.display.offsetHeight;
    this.container.style.height = `${containerHeight}px`;
  }

  private _recalcVisibilityStylesFor(styles: CSSStyleDeclaration, show: boolean): void {
    if (show) {
      styles.removeProperty('display');
      setTimeout(() => styles.removeProperty('opacity'));
    } else {
      styles.display = 'none';
      styles.opacity = '0';
    }
  }

  ngOnDestroy(): void {
    // Cleanup any RxJS subscriptions.
    this._destroy$.next();
  }
}
