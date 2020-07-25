import { Component, OnInit } from '@angular/core';
import { PasswordComponent } from '~web/password/password/password.component';

@Component({
  selector: 'foodweb-admin-password',
  templateUrl: './admin-password.component.html',
  styleUrls: [
    '../../../../../../web/src/app/password/child-components/password/password.component.scss',
    './admin-password.component.scss'
  ],
})
export class AdminPasswordComponent extends PasswordComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
