import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import { UsernameBaseComponent } from './username.base.component';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: formProvider(UsernameComponent)
})
export class UsernameComponent extends UsernameBaseComponent {

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }
}
