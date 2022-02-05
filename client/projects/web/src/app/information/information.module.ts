import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AboutComponent } from './components/about/about.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  declarations: [
    AboutComponent,
    PrivacyStatementComponent,
  ],
  imports: [
    CommonModule,
    InformationRoutingModule,
    MatCardModule,
  ]
})
export class InformationModule {}
