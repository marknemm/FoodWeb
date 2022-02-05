import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AboutComponent } from './components/about/about.component';
import { MessageUsComponent } from './components/message-us/message-us.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';
import { InformationRoutingModule } from './information-routing.module';

@NgModule({
  declarations: [
    AboutComponent,
    MessageUsComponent,
    PrivacyStatementComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    InformationRoutingModule,
    SharedModule
  ]
})
export class InformationModule {}
