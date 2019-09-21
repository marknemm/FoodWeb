import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { AlertSnackBarComponent } from './components/alert-snack-bar/alert-snack-bar.component';

import { ProgressIndicatorComponent } from './child-components/progress-indicator/progress-indicator.component';
import { EditSaveButtonComponent } from './child-components/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from './child-components/paginator/paginator.component';

import { ReturnLinkDirective } from './directives/return-link/return-link.directive';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from './directives/display-edit-transition/display-edit-transition.directive';

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
  ]
})
export class SharedModule {}
