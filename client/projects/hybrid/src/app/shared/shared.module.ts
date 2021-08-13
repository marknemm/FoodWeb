import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule as WebSharedModule } from '~web/shared/shared.module';
import { HeaderComponent } from './child-components/header/header.component';
import { FocusNextDirective } from './directives/focus-next/focus-next.directive';
import { FormFieldDirective } from './directives/form-field/form-field.directive';

@NgModule({
  declarations: [
    FocusNextDirective,
    FormFieldDirective,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    WebSharedModule,
  ],
  exports: [
    // Works as if we are extending the base Web SharedModule.
    WebSharedModule,
    FocusNextDirective,
    FormFieldDirective,
    HeaderComponent,
  ]
})
export class SharedModule {}
