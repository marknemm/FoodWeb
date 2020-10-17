import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminConsoleRoutingModule } from './admin-console-routing.module';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';

@NgModule({
  declarations: [
    AdminConsoleComponent,
  ],
  imports: [
    AdminConsoleRoutingModule,
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRippleModule,
  ]
})
export class AdminConsoleModule {}
