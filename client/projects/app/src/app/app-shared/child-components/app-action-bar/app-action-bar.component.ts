import { Component, Input, OnInit } from '@angular/core';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'foodweb-app-action-bar',
  templateUrl: './app-action-bar.component.html',
  styleUrls: ['./app-action-bar.component.scss']
})
export class AppActionBarComponent implements OnInit {

  @Input() pageTitle: string;

  constructor() {}

  ngOnInit() {}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

}
