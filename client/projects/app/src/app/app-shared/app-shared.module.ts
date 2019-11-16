import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    // Works as if we are extending the base Web SharedModule.
    SharedModule
  ]
})
export class AppSessionModule {}
