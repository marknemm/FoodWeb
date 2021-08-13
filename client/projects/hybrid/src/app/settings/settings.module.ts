import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountModule as WebAccountModule } from '~web/account/account.module';
import { SettingsPortalComponent } from './components/settings-portal/settings-portal.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingsPortalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    SettingsRoutingModule,
    WebAccountModule,
  ],
  exports: [
    WebAccountModule,
  ]
})
export class SettingsModule {}
