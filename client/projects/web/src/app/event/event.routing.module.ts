import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventRegistrationsComponent } from '~web/event';

const routes: Routes = [
  { path: 'registrations', component: EventRegistrationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
