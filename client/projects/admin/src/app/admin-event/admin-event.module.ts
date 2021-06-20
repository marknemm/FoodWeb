import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminEventSharedModule } from '~admin/admin-event-shared/admin-event-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { EventModule } from '~web/event/event.module';
import { SharedModule } from '~web/shared/shared.module';
import { TableModule } from '~web/table/table.module';
import { AdminEventRoutingModule } from './admin-event-routing.module';
import { EventFormComponent } from './child-components/event-form/event-form.component';
import { AdminEventsComponent } from './components/admin-events/admin-events.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';

@NgModule({
  declarations: [
    EventCreateComponent,
    EventEditComponent,
    EventRegistrationsComponent,
    EventFormComponent,
    AdminEventsComponent,
  ],
  imports: [
    AdminEventRoutingModule,
    AdminEventSharedModule,
    DateTimeModule,
    EventModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    SharedModule,
    TableModule,
  ],
  exports: [
    EventModule, // Works as if we are extending the base Web EventModule.
  ]
})
export class AdminEventModule {}
