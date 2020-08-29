import { Component, OnInit } from '@angular/core';
import { AccountCreationFormBaseComponent } from '~web/account/child-components/account-creation-form/account-creation-form.base.component';

@Component({
  selector: 'foodweb-app-account-creation-form',
  templateUrl: './app-account-creation-form.component.html',
  styleUrls: ['./app-account-creation-form.component.scss']
})
export class AppAccountCreationFormComponent extends AccountCreationFormBaseComponent implements OnInit {

  constructor() {
    super()
  }

  ngOnInit() {}

}
