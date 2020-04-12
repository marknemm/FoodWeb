import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeveloperPortalComponent } from '~admin/developer/developer-portal/developer-portal.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { DeveloperRoutingModule } from './developer-routing.module';

@NgModule({
  declarations: [
    DeveloperPortalComponent
  ],
  imports: [
    DeveloperRoutingModule,
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class DeveloperModule {}
