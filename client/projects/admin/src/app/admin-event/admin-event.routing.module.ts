import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFeaturedEventComponent } from '~admin/admin-event/create-featured-event/create-featured-event.component';
import { EditFeaturedEventComponent } from '~admin/admin-event/edit-featured-event/edit-featured-event.component';
import { EventRegistrationsComponent } from '~admin/admin-event/event-registrations/event-registrations.component';
import { FeaturedEventsComponent } from '~admin/admin-event/featured-events/featured-events.component';

const routes: Routes = [
  { path: 'create', component: CreateFeaturedEventComponent },
  { path: 'edit/:id', component: EditFeaturedEventComponent },
  { path: 'list', component: FeaturedEventsComponent },
  { path: 'registrations/:id', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEventRoutingModule {}
