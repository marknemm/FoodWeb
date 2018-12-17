import { Component } from '@angular/core';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly FOOTER_HEIGHT = 25;
  readonly BODY_MARGIN = 30;
  bodyHeight: number;

  constructor() {
    window.addEventListener('resize', this.recalcMinBodyHeight.bind(this));
    this.recalcMinBodyHeight();
  }

  private recalcMinBodyHeight(): void {
    this.bodyHeight = window.innerHeight - (this.FOOTER_HEIGHT + this.BODY_MARGIN);
  }
}
