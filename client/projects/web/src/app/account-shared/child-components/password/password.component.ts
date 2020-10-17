import { Component } from '@angular/core';
import { formProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { PasswordBaseComponent } from './password.base.component';

@Component({
  selector: 'foodweb-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: formProvider(PasswordComponent)
})
export class PasswordComponent extends PasswordBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
