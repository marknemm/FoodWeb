import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';
import { MaterialModule } from '~web/material.module';
import { EditSaveButtonComponent } from './child-components/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from './child-components/paginator/paginator.component';
import { ProgressIndicatorComponent } from './child-components/progress-indicator/progress-indicator.component';
import { SearchBarComponent } from './child-components/search-bar/search-bar.component';
import { YesNoComponent } from './child-components/yes-no/yes-no.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from './directives/display-edit-transition/display-edit-transition.directive';
import { FragmentAccordianDirective } from './directives/fragment-accordian/fragment-accordian.directive';
import { ReturnLinkDirective } from './directives/return-link/return-link.directive';
import { IeAlertService } from './services/ie-alert/ie-alert.service';

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
