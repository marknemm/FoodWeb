import { Component } from '@angular/core';
import { PasswordBaseComponent } from '~web/account-shared/child-components/password/password.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-password',
  templateUrl: './app-password.component.html',
  styleUrls: ['./app-password.component.scss'],
  providers: valueAccessorProvider(AppPasswordComponent)
})
export class AppPasswordComponent extends PasswordBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
