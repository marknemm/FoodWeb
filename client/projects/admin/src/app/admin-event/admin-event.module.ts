import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminEventCardComponent } from '~admin/admin-event/admin-event-card/admin-event-card.component';
import { AdminEventRoutingModule } from '~admin/admin-event/admin-event.routing.module';
import { CreateFeaturedEventComponent } from '~admin/admin-event/create-featured-event/create-featured-event.component';
import { EditFeaturedEventComponent } from '~admin/admin-event/edit-featured-event/edit-featured-event.component';
import { EventRegistrationsComponent } from '~admin/admin-event/event-registrations/event-registrations.component';
import { FeaturedEventFormComponent } from '~admin/admin-event/featured-event-form/featured-event-form.component';
import { FeaturedEventsComponent } from '~admin/admin-event/featured-events/featured-events.component';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { EventModule } from '~web/event/event.module';
import { MaterialModule } from '~web/material.module';
import { SharedModule } from '~web/shared/shared.module';
import { TableModule } from '~web/table/table.module';

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
