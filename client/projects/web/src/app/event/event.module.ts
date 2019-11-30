import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EventCardComponent } from '~web/event/event-card/event-card.component';
import { EventRegistrationsComponent } from '~web/event/event-registrations/event-registrations.component';
import { EventRoutingModule } from '~web/event/event.routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

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
