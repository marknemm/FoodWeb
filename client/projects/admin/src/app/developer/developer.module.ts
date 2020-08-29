import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '~web/shared/shared.module';
import { DeveloperRoutingModule } from './developer-routing.module';

@NgModule({
  declarations: [],
  imports: [
    DeveloperRoutingModule,
    CommonModule,
    SharedModule,
  ]
})
export class DeveloperModule {}
