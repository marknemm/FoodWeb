import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventRegistrationsComponent } from './components/event-registrations/event-registrations.component';

const routes: Routes = [
  { path: 'registrations', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
