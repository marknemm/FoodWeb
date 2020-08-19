import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { isAndroid, isIOS } from '@nativescript/core';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';

@Component({
  selector: 'foodweb-app-action-bar',
  templateUrl: './app-action-bar.component.html',
  styleUrls: ['./app-action-bar.component.scss']
})
export class AppActionBarComponent implements OnInit {

  readonly isAndroid: boolean = isAndroid;
  readonly isIOS: boolean = isIOS;

  constructor(
    public leftNavService: AppLeftNavService,
    public router: RouterExtensions,
  ) {}

  ngOnInit() {}

}
