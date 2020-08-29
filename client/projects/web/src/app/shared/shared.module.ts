import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AlertModule } from '~web/alert/alert.module';
import { EditSaveButtonComponent } from './child-components/edit-save-button/edit-save-button.component';
import { PaginatorComponent } from './child-components/paginator/paginator.component';
import { ProgressIndicatorComponent } from './child-components/progress-indicator/progress-indicator.component';
import { SearchBarComponent } from './child-components/search-bar/search-bar.component';
import { YesNoComponent } from './child-components/yes-no/yes-no.component';
import { ConfirmButtonDirective } from './directives/confirm-button/confirm-button.directive';
import { DisplayEditTransitionDirective } from './directives/display-edit-transition/display-edit-transition.directive';
import { FragmentAccordianDirective } from './directives/fragment-accordian/fragment-accordian.directive';
import { ReturnLinkDirective } from './directives/return-link/return-link.directive';
import { WindowSizeDirective } from './directives/window-size/window-size.directive';

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
    SearchBarComponent,
    WindowSizeDirective
  ],
  imports: [
    RouterModule.forChild([]),
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
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
  ]
})
export class SharedModule {}
