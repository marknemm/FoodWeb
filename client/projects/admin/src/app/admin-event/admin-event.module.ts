import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminEventRoutingModule } from '~admin/admin-event/admin-event.routing.module';
import { EventRegistrationsComponent } from '~admin/admin-event/event-registrations/event-registrations.component';
import { EventModule } from '~web/event/event.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    EventRegistrationsComponent
  ],
  imports: [
    AdminEventRoutingModule,
    EventModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminEventModule {}
