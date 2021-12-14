import { Component } from '@angular/core';
import { AccountTypeComponent as WebAccountTypeComponent } from '~web/account-shared/child-components/account-type/account-type.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss'],
  providers: [FormFieldService]
})
export class AccountTypeComponent extends WebAccountTypeComponent {}
