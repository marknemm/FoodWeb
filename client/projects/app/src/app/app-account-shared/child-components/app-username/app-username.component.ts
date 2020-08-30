import { Component } from '@angular/core';
import { UsernameBaseComponent } from '~web/account-shared/child-components/username/username.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-username',
  templateUrl: './app-username.component.html',
  styleUrls: ['./app-username.component.scss'],
  providers: valueAccessorProvider(AppUsernameComponent)
})
export class AppUsernameComponent extends UsernameBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
