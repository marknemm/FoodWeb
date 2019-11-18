import { Directive, Inject, HostListener, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { LeftNavService } from '~web/left-nav/left-nav.service';

@Directive({
  selector: '[foodWebStickyHeader]'
})
export class StickyHeaderDirective {

  @Input() mainHeader: MatToolbar;
  @Input() subHeader: HTMLElement;

  constructor(
    @Inject('Window') private _window: Window,
    @Inject(DOCUMENT) private _document: Document,
    private _leftNavService: LeftNavService
  ) {}

  @HostListener('window:scroll')
  _onWindowScroll(): void {
    if (this._window.innerWidth < 767 && this.mainHeader && this.subHeader) {
      const mainHeaderHeight: number = this.mainHeader._elementRef.nativeElement.offsetHeight;
      const subHeaderHeight: number = this.subHeader.offsetHeight;
      const headerHeight: number = (mainHeaderHeight + subHeaderHeight);
      const scrollY: number = this._window.pageYOffset;
      if (scrollY >= headerHeight) {
        this._setPositionSticky();
      } else if (scrollY <= mainHeaderHeight) {
        this._setPositionRelative();
      }
    }
  }

  private _setPositionSticky(): void {
    if (!this.subHeader.classList.contains('sticky')) {
      this.subHeader.classList.add('sticky');
      this._leftNavService.sticky = true;
      this._document.body.classList.add('sticky-header');
      setTimeout(() => this.subHeader.classList.add('slide-in'));
    }
  }

  private _setPositionRelative(): void {
    if (this.subHeader.classList.contains('sticky')) {
      this.subHeader.classList.remove('sticky');
      this.subHeader.classList.remove('slide-in');
      this._document.body.classList.remove('sticky-header');
      this._leftNavService.sticky = false;
    }
  }
}
