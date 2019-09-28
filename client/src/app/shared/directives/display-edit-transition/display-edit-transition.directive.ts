import { Directive, Input, ElementRef, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[foodWebDisplayEditTransition]',
  exportAs: 'editDisplayTransition'
})
export class DisplayEditTransitionDirective implements OnInit, OnChanges, OnDestroy {

  @Input('foodWebDisplayEditTransition') editing = false;
  @Input() form: HTMLElement;
  @Input() display: HTMLElement;
  @Input() duration = '0.25s';
  @Input() heightRecalcAtMs: number[];
  @Input() recalcTrigger: Observable<any>;

  readonly container: HTMLElement;

  private _destory$ = new Subject();

  constructor(elementRef: ElementRef) {
    this.container = elementRef.nativeElement;
  }

  ngOnInit() {
    this._recalcContainerHeight = this._recalcContainerHeight.bind(this);
    window.addEventListener('resize', this._recalcContainerHeight);
    this._initStyles();
  }

  private _initStyles(): void {
    const containerStyles: CSSStyleDeclaration = this.container.style
    containerStyles.transition = `height ${this.duration} ease-in-out`;
    containerStyles.overflow = 'hidden';
    this.form.style.transition = `opacity ${this.duration} ease-in-out`;
    this.display.style.transition = `opacity ${this.duration} ease-in-out`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing || changes.form || changes.display) {
      this.recalcStyles();
    }
    if (changes.recalcTrigger) {
      this._updateRecalcTrigger();
    }
  }

  recalcStyles(): void {
    this._recalcStylesFor(this.form.style, this.editing);
    this._recalcStylesFor(this.display.style, !this.editing);
    const heightRecalcAtMs = this.heightRecalcAtMs ? this.heightRecalcAtMs : [0];
    heightRecalcAtMs.forEach((subMs: number) => {
      setTimeout(() => this._recalcContainerHeight(), subMs);
    });
  }

  private _recalcContainerHeight(): void {
    const containerHeight: number = (this.editing)
      ? this.form.offsetHeight
      : this.display.offsetHeight;
    this.container.style.height = `${containerHeight}px`;
  }

  private _recalcStylesFor(styles: CSSStyleDeclaration, show: boolean): void {
    if (show) {
      styles.display = null;
      setTimeout(() => {
        styles.opacity = '1';
      });
    } else {
      styles.display = 'none';
      styles.opacity = '0';
    }
  }

  private _updateRecalcTrigger(): void {
    this._destory$.next();
    this.recalcTrigger.pipe(
      takeUntil(this._destory$)
    ).subscribe(() => this.recalcStyles());
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this._recalcContainerHeight);
    this._destory$.next();
  }
}
