import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { EventSharedModule } from '~web/event-shared/event-shared.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild([]),
    EventSharedModule,
    HeuristicsModule,
  ]
})
export class HomeModule {}
