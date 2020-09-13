import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { UsernameBaseComponent } from '~web/account-shared/child-components/username/username.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-username',
  templateUrl: './app-username.component.html',
  styleUrls: ['./app-username.component.scss'],
  providers: valueAccessorProvider(AppUsernameComponent)
})
export class AppUsernameComponent extends UsernameBaseComponent implements Focusable {

  @ViewChild('usernameField', { static: true }) firstFocusable: ElementRef<AppTextFieldComponent>;

  @Output() finalReturnPress = new EventEmitter();

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  focus(): void {
    this.firstFocusable.nativeElement.focus();
  }
}
