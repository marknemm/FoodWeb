import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';
import { MaterialModule } from '~web/material.module';
import { AlertDialogComponent } from '~web/shared/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/shared/alert-snack-bar/alert-snack-bar.component';
import { ConfirmButtonDirective } from '~web/shared/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from '~web/shared/display-edit-transition/display-edit-transition.directive';
import { EditSaveButtonComponent } from '~web/shared/edit-save-button/edit-save-button.component';
import { FragmentAccordianDirective } from '~web/shared/fragment-accordian/fragment-accordian.directive';
import { IeAlertService } from '~web/shared/ie-alert/ie-alert.service';
import { PaginatorComponent } from '~web/shared/paginator/paginator.component';
import { ProgressIndicatorComponent } from '~web/shared/progress-indicator/progress-indicator.component';
import { ReturnLinkDirective } from '~web/shared/return-link/return-link.directive';
import { SearchBarComponent } from '~web/shared/search-bar/search-bar.component';
import { YesNoComponent } from '~web/shared/yes-no/yes-no.component';

@NgModule({
  declarations: [
    AlertDialogComponent,
    AlertSnackBarComponent,
    ProgressIndicatorComponent,
    EditSaveButtonComponent,
    PaginatorComponent,
    ReturnLinkDirective,
    ConfirmButtonDirective,
    DisplayEditTransitionDirective,
    FragmentAccordianDirective,
    YesNoComponent,
    SearchBarComponent
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    AlertDialogComponent,
    AlertSnackBarComponent,
    ProgressIndicatorComponent,
    EditSaveButtonComponent,
    PaginatorComponent,
    ReturnLinkDirective,
    ConfirmButtonDirective,
    DisplayEditTransitionDirective,
    FragmentAccordianDirective,
    YesNoComponent,
    SearchBarComponent
  ],
  providers: [
    { provide: 'Window', useValue: window },
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver
  ]
})
export class SharedModule {

  constructor(
    ieAlert: IeAlertService,
    jsonDateReviver: JSONDateReviver
  ) {
    ieAlert.showIEWarning();
    jsonDateReviver.initJSONDateReviver();
  }

}
