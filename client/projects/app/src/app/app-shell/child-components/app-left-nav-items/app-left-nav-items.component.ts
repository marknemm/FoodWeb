import { Component, OnInit } from '@angular/core';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';

@Component({
  selector: 'foodweb-app-left-nav-items',
  templateUrl: './app-left-nav-items.component.html',
  styleUrls: ['./app-left-nav-items.component.scss']
})
export class AppLeftNavItemsComponent implements OnInit {

  constructor(
    public leftNavService: AppLeftNavService
  ) {}

  ngOnInit() {}

}
