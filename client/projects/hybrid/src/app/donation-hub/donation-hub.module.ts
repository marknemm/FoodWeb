import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~hybrid/account-shared/account-shared.module';
import { DateTimeModule } from '~hybrid/date-time/date-time.module';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DonationHubModule as WebDonationHubModule } from '~web/donation-hub/donation-hub.module';
import { DonationHubActionsComponent } from './child-comopnents/donation-hub-actions/donation-hub-actions.component';
import { DonationHubDropOffInfoComponent } from './child-comopnents/donation-hub-drop-off-info/donation-hub-drop-off-info.component';
import { DonationHubPledgeMiniListComponent } from './child-comopnents/donation-hub-pledge-mini-list/donation-hub-pledge-mini-list.component';
import { DonationHubTeaserComponent } from './child-comopnents/donation-hub-teaser/donation-hub-teaser.component';
import { DonationHubCreateComponent } from './components/donation-hub-create/donation-hub-create.component';
import { DonationHubEditComponent } from './components/donation-hub-edit/donation-hub-edit.component';
import { DonationHubListComponent } from './components/donation-hub-list/donation-hub-list.component';
import { DonationHubPledgeCreateComponent } from './components/donation-hub-pledge-create/donation-hub-pledge-create.component';
import { DonationHubPledgeEditComponent } from './components/donation-hub-pledge-edit/donation-hub-pledge-edit.component';
import { DonationHubPledgeListComponent } from './components/donation-hub-pledge-list/donation-hub-pledge-list.component';
import { DonationHubPledgeComponent } from './components/donation-hub-pledge/donation-hub-pledge.component';
import { DonationHubPortalComponent } from './components/donation-hub-portal/donation-hub-portal.component';
import { DonationHubComponent } from './components/donation-hub/donation-hub.component';
import { DonationHubRoutingModule } from './donation-hub-routing.module';
import { DonationHubPledgeFormComponent } from './child-comopnents/donation-hub-pledge-form/donation-hub-pledge-form.component';

@NgModule({
  declarations: [
    DonationHubActionsComponent,
    DonationHubComponent,
    DonationHubCreateComponent,
    DonationHubDropOffInfoComponent,
    DonationHubEditComponent,
    DonationHubListComponent,
    DonationHubPledgeComponent,
    DonationHubPledgeCreateComponent,
    DonationHubPledgeEditComponent,
    DonationHubPledgeListComponent,
    DonationHubPledgeMiniListComponent,
    DonationHubPortalComponent,
    DonationHubTeaserComponent,
    DonationHubPledgeFormComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatExpansionModule,
    ReactiveFormsModule,
    DonationHubRoutingModule,
    WebDonationHubModule,
    SharedModule,
    DateTimeModule,
    AccountSharedModule,
  ],
  exports: [
    WebDonationHubModule
  ]
})
export class DonationHubModule {}
