import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EventSharedModule } from '~web/event-shared/event-shared.module';
import { SharedModule } from '~web/shared/shared.module';
import { EventsComponent } from './components/events/events.component';
import { EventRoutingModule } from './event.routing.module';

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    EventRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    EventSharedModule,
  ]
})
export class EventModule {}
