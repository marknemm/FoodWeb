import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEventsComponent } from './components/admin-events/admin-events.component';
import { CreateFeaturedEventComponent } from './components/create-featured-event/create-featured-event.component';
import { EditFeaturedEventComponent } from './components/edit-featured-event/edit-featured-event.component';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';

const routes: Routes = [
  { path: 'create', component: CreateFeaturedEventComponent },
  { path: 'edit/:id', component: EditFeaturedEventComponent },
  { path: 'list', component: AdminEventsComponent },
  { path: 'registrations/:id', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEventRoutingModule {}
