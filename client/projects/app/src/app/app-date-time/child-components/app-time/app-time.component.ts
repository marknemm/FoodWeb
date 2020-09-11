import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { TimeBaseComponent } from '~web/date-time/child-components/time/time.base.component';
import { DateTimeService } from '~web/date-time/services/date-time/date-time.service';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { AppTimeDialogComponent } from '../app-time-dialog/app-time-dialog.component';

@Component({
  selector: 'foodweb-app-time',
  templateUrl: './app-time.component.html',
  styleUrls: ['./app-time.component.scss'],
  providers: valueAccessorProvider(AppTimeComponent)
})
export class AppTimeComponent extends TimeBaseComponent {

  constructor(
    private _dateTimeService: DateTimeService,
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService,
  ) {
    super(formHelperService);
  }

  showTimeDialog(timeTextField: AppTextFieldComponent): void {
    timeTextField.dismissSoftInput();
    this._modalDialogService
      .showModal(AppTimeDialogComponent, {
        viewContainerRef: this._viewContainerRef
      })
      .then((time: Date) => {
        if (time) {
          const timeStr: string = this._dateTimeService.toLocalTimeStr(time);
          this.formControl.setValue(timeStr);
        }
      });
  }
}
