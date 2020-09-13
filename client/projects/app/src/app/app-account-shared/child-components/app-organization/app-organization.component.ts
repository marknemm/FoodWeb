import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { Focusable } from '~app/app-shared/interfaces/focusable';
import { OrganizationBaseComponent } from '~web/account-shared/child-components/organization/organization.base.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-app-organization',
  templateUrl: './app-organization.component.html',
  styleUrls: ['./app-organization.component.scss'],
  providers: valueAccessorProvider(AppOrganizationComponent)
})
export class AppOrganizationComponent extends OrganizationBaseComponent implements Focusable {

  @Output() finalReturnPress = new EventEmitter<void>();

  @ViewChild('organizationNameField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(formHelperService: FormHelperService) {
    super(formHelperService);
  }

  focus(): void {
    this.firstFocusable.focus();
  }
}
