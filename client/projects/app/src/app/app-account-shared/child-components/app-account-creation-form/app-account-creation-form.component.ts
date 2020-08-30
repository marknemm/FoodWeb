import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { AccountCreationFormBaseComponent } from '~web/account-shared/child-components/account-creation-form/account-creation-form.base.component';

@Component({
  selector: 'foodweb-app-account-creation-form',
  templateUrl: './app-account-creation-form.component.html',
  styleUrls: ['./app-account-creation-form.component.scss']
})
export class AppAccountCreationFormComponent extends AccountCreationFormBaseComponent implements OnInit {

  constructor(
    protected _activatedRoute: ActivatedRoute,
    private _routerExt: RouterExtensions,
  ) {
    super(_activatedRoute, _routerExt.router);
  }

}
