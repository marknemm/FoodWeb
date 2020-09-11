import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { AppTextFieldComponent } from '~app/app-shared/child-components/app-text-field/app-text-field.component';
import { valueAccessorProvider } from '~web/data-structure/form-base-component';
import { DateBaseComponent } from '~web/date-time/child-components/date/date.base.component';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { AppDateDialogComponent } from '../app-date-dialog/app-date-dialog.component';

@Component({
  selector: 'foodweb-app-date',
  templateUrl: './app-date.component.html',
  styleUrls: ['./app-date.component.scss'],
  providers: valueAccessorProvider(AppDateComponent)
})
export class AppDateComponent extends DateBaseComponent {

  constructor(
    private _modalDialogService: ModalDialogService,
    private _viewContainerRef: ViewContainerRef,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  showDateDialog(dateTextField: AppTextFieldComponent): void {
    dateTextField.dismissSoftInput();
    this._modalDialogService
      .showModal(AppDateDialogComponent, {
        viewContainerRef: this._viewContainerRef
      })
      .then((date: Date) => {
        if (date) {
          this.formControl.setValue(date);
        }
      });
  }
}
