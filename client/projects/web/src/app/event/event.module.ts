import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule } from './event.routing.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';

import { EventRegistrationsComponent, EventCardComponent } from '~web/event';

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
