import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    TabsComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    TabsRoutingModule,
    IonicModule,
    SharedModule,
    AccountSharedModule
  ],
  exports: []
})
export class TabsModule {}
