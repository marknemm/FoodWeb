import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EventCardComponent } from '~web/event/event-card/event-card.component';
import { EventRegistrationsComponent } from '~web/event/event-registrations/event-registrations.component';
import { EventRoutingModule } from '~web/event/event.routing.module';
import { EventsComponent } from '~web/event/events/events.component';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

@NgModule({
  declarations: [
    EventCardComponent,
    EventsComponent,
    EventRegistrationsComponent
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
