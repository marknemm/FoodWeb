import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './components/about/about.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';

@NgModule({
  declarations: [
    AboutComponent,
    PrivacyStatementComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatCardModule,
  ]
})
export class AboutModule {}
