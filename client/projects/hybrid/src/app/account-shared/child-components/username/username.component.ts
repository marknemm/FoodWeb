import { Component } from '@angular/core';
import { UsernameComponent as WebUsernameComponent } from '~web/account-shared/child-components/username/username.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: [FormFieldService]
})
export class UsernameComponent extends WebUsernameComponent {}
