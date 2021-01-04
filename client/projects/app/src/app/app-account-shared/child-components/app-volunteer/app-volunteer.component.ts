import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { AppFocusService, Focusable, FocusableComponent } from '~app/app-shared/services/app-focus/app-focus.service';
import { VolunteerBaseComponent } from '~web/account-shared/child-components/volunteer/volunteer.base.component';
import { FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-app-volunteer',
  templateUrl: './app-volunteer.component.html',
  styleUrls: ['./app-volunteer.component.scss'],
  providers: formProvider(AppVolunteerComponent)
})
export class AppVolunteerComponent extends VolunteerBaseComponent implements FocusableComponent {

  @Input() visible: VisibleInput = 'visible';
  @Input() nextFocus: Focusable;

  @Output() finalReturnPress = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('focus') focusOutput = new EventEmitter();

  @ViewChild('fullNameField', { static: true }) firstFocusable: AppTextFieldComponent;

  constructor(
    private _focusService: AppFocusService,
    formHelperService: FormHelperService
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
