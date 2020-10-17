import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { EventSharedModule } from '~web/event-shared/event-shared.module';
import { AdminEventCardComponent } from './child-components/admin-event-card/admin-event-card.component';

@NgModule({
  declarations: [
    AdminEventCardComponent,
  ],
  imports: [
    CommonModule,
    EventSharedModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forChild([]),
  ],
  exports: [
    AdminEventCardComponent,
    EventSharedModule, // Like extending (Web) EventSharedModule.
  ]
})
export class AdminEventSharedModule {}
