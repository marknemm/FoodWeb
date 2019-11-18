import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '~web/material.module';
import { AccountHelper, OperationHoursHelper, DonationHelper, DeliveryHelper, JSONDateReviver } from '~shared';

import { AlertDialogComponent } from '~web/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from '~web/alert-snack-bar/alert-snack-bar.component';
import { ProgressIndicatorComponent } from '~web/progress-indicator/progress-indicator.component';
import { EditSaveButtonComponent } from '~web/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from '~web/paginator/paginator.component';
import { ReturnLinkDirective } from '~web/return-link/return-link.directive';
import { ConfirmButtonDirective } from '~web/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from '~web/display-edit-transition/display-edit-transition.directive';

@NgModule({
  declarations: [
    AlertDialogComponent,
    AlertSnackBarComponent,
    ProgressIndicatorComponent,
    EditSaveButtonComponent,
    PaginatorComponent,
    ReturnLinkDirective,
    ConfirmButtonDirective,
    DisplayEditTransitionDirective
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
    DisplayEditTransitionDirective
  ],
  entryComponents: [
    AlertDialogComponent,
    AlertSnackBarComponent
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
export class SharedModule {}
