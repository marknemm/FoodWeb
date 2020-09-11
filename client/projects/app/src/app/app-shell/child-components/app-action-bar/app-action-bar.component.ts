import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { isAndroid, isIOS } from '@nativescript/core';
import { AppBackService } from '~app/app-shared/services/app-back/app-back.service';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';

@Component({
  selector: 'foodweb-app-action-bar',
  templateUrl: './app-action-bar.component.html',
  styleUrls: ['./app-action-bar.component.scss']
})
export class AppActionBarComponent implements OnInit {

  readonly isAndroid: boolean = isAndroid;
  readonly isIOS: boolean = isIOS;

  @Input() pageTitle = 'FoodWeb';

  constructor(
    public backService: AppBackService,
    public leftNavService: AppLeftNavService,
    public router: RouterExtensions,
  ) {}

  ngOnInit() {}

}
