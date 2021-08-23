import { Component, HostBinding } from '@angular/core';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss'],
  providers: formProvider(UsernameComponent)
})
export class UsernameComponent extends FormBaseComponent<string> {

  @HostBinding()
  readonly class = 'foodweb-username';

  constructor(formHelperService: FormHelperService) {
    super(() => new TFormControl<string>(), formHelperService);
  }

}
