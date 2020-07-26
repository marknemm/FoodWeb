import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { EventCardComponent } from './child-components/event-card/event-card.component';
import { EventsComponent } from './components/events/events.component';
import { EventRoutingModule } from './event.routing.module';

@NgModule({
  declarations: [
    EventCardComponent,
    EventsComponent
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
