import { Component, Input } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { LeftNavComponent } from './../left-nav/left-nav.component';

@Component({
  selector: 'food-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() leftNav: LeftNavComponent;

  title: string;

  constructor(
    router: Router,
  ) {
    router.events.subscribe((event: RouterEvent) => {
      switch (event.url) {
        default:
          this.title = 'Home';
      }
    });
  }

}
