import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'food-web-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  isOpen: boolean;
  mode: 'side' | 'over';

  private _prevWidth: number;

  ngOnInit() {
    this.onWindowResize();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth <= 991 && (!this._prevWidth || this._prevWidth > 991)) {
      this.isOpen = false;
      this.mode = 'over';
    } else if (window.innerWidth > 991 && (!this._prevWidth || this._prevWidth <= 991)) {
      this.isOpen = true;
      this.mode = 'side';
    }
    this._prevWidth = window.innerWidth;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  _onNavClick(): void {
    if (this.mode === 'over') {
      this.toggle();
    }
  }

}
