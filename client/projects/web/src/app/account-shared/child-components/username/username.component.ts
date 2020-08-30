import { Component } from '@angular/core';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { UsernameBaseComponent } from './username.base.component';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: valueAccessorProvider(UsernameComponent)
})
export class UsernameComponent extends UsernameBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
