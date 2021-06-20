import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEventsComponent } from './components/admin-events/admin-events.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';

const routes: Routes = [
  { path: 'create', component: EventCreateComponent },
  { path: 'edit/:id', component: EventEditComponent },
  { path: 'list', component: AdminEventsComponent },
  { path: 'registrations/:id', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEventRoutingModule {}
