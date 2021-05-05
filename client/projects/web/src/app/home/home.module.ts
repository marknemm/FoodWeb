import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { SupportInfoComponent } from '~web/account-shared/child-components/support-info/support-info.component';
import { EventSharedModule } from '~web/event-shared/event-shared.module';
import { HeuristicsModule } from '~web/heuristics/heuristics.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
    SupportInfoComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    RouterModule.forChild([]),
    EventSharedModule,
    HeuristicsModule,
  ]
})
export class HomeModule {}
