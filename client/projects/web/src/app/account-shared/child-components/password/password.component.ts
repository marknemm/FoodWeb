import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
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
