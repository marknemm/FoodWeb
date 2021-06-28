import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule as WebSharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WebSharedModule
  ],
  exports: [
    // Works as if we are extending the base Web SharedModule.
    WebSharedModule
  ]
})
export class SharedModule {}
