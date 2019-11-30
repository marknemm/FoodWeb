import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventRegistrationsComponent } from '~web/event/event-registrations/event-registrations.component';

const routes: Routes = [
  { path: 'registrations', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
