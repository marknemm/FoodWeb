import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AccountHelper, DeliveryHelper, DonationHelper, JSONDateReviver, OperationHoursHelper } from '~shared';
import { AlertModule } from '~web/alert/alert.module';
import { MaterialModule } from '~web/material.module';
import { EditSaveButtonComponent } from './child-components/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from './child-components/paginator/paginator.component';
import { ProgressIndicatorComponent } from './child-components/progress-indicator/progress-indicator.component';
import { SearchBarComponent } from './child-components/search-bar/search-bar.component';
import { YesNoComponent } from './child-components/yes-no/yes-no.component';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from './directives/display-edit-transition/display-edit-transition.directive';
import { FragmentAccordianDirective } from './directives/fragment-accordian/fragment-accordian.directive';
import { ReturnLinkDirective } from './directives/return-link/return-link.directive';

@NgModule({
  declarations: [
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
    NgxMaterialTimepickerModule,
    AlertModule,
  ],
  exports: [
    AlertModule,
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
    AccountHelper,
    OperationHoursHelper,
    DonationHelper,
    DeliveryHelper,
    JSONDateReviver
  ]
})
export class SharedModule {}
