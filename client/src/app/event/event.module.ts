import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule } from './event.routing.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';
import { EventCardComponent } from './child-components/event-card/event-card.component';


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
