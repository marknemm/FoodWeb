import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { AccountModule as WebAccountModule } from '~web/account/account.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './components/account/account.component';
import { AccountListComponent } from './components/account-list/account-list.component';

@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    WebAccountModule,
    AccountSharedModule,
    SharedModule,
  ],
  exports: [
    WebAccountModule,
  ]
})
export class AccountModule {}
