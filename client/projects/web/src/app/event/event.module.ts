import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule } from '~web/event.routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared.module';

import { EventRegistrationsComponent } from '~web/event-registrations/event-registrations.component';
import { EventCardComponent } from '~web/event-card/event-card.component';

@NgModule({
  declarations: [
    EventRegistrationsComponent,
    EventCardComponent
  ],
  imports: [
    EventRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    EventCardComponent
  ]
})
export class EventModule {}
