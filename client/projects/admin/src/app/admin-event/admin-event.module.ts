import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { EventModule } from '~web/event/event.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { TableModule } from '~web/table/table.module';
import { AdminEventRoutingModule } from './admin-event.routing.module';
import { AdminEventCardComponent } from './child-components/admin-event-card/admin-event-card.component';
import { FeaturedEventFormComponent } from './child-components/featured-event-form/featured-event-form.component';
import { CreateFeaturedEventComponent } from './components/create-featured-event/create-featured-event.component';
import { EditFeaturedEventComponent } from './components/edit-featured-event/edit-featured-event.component';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';
import { FeaturedEventsComponent } from './components/featured-events/featured-events.component';

@NgModule({
  declarations: [
    AdminEventCardComponent,
    CreateFeaturedEventComponent,
    EditFeaturedEventComponent,
    EventRegistrationsComponent,
    FeaturedEventFormComponent,
    FeaturedEventsComponent
  ],
  imports: [
    AdminEventRoutingModule,
    DateTimeModule,
    EventModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    TableModule
  ],
  exports: [
    // Works as if we are extending the base Web EventModule.
    EventModule
  ]
})
export class AdminEventModule {}
