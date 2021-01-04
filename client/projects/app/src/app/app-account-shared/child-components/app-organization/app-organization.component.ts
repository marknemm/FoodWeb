import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { OrganizationBaseComponent } from '~web/account-shared/child-components/organization/organization.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-organization',
  templateUrl: './app-organization.component.html',
  styleUrls: ['./app-organization.component.scss'],
  providers: formProvider(AppOrganizationComponent)
})
export class AppOrganizationComponent extends OrganizationBaseComponent implements FocusableComponent {

  @Input() nextFocus: Focusable;

  @Output() finalReturnPress = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('organizationNameField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService,
  ) {
    super(formHelperService);
  }

  get focusable(): boolean {
    return this.editable;
  }

  focus(): boolean {
    return this._focusService.focus(this, this.firstFocusable);
  }
}
