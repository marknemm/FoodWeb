import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule as WebSharedModule } from '~web/shared/shared.module';
import { HeaderComponent } from './child-components/header/header.component';
import { RequirementsChecklistComponent } from './child-components/requirements-checklist/requirements-checklist.component';
import { FocusNextDirective } from './directives/focus-next/focus-next.directive';

@NgModule({
  declarations: [
    FocusNextDirective,
    HeaderComponent,
    RequirementsChecklistComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    WebSharedModule,
  ],
  exports: [
    // Works as if we are extending the base Web SharedModule.
    WebSharedModule,
    FocusNextDirective,
    HeaderComponent,
    RequirementsChecklistComponent,
  ]
})
export class SharedModule {}
