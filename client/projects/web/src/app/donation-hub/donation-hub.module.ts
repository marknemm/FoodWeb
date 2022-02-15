import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { AccountSharedModule } from '~web/account-shared/account-shared.module';
import { DateTimeModule } from '~web/date-time/date-time.module';
import { PageListModule } from '~web/page-list/page-list.module';
import { SharedModule } from '~web/shared/shared.module';
import { TableModule } from '~web/table/table.module';
import { DonationHubActionsComponent } from './child-components/donation-hub-actions/donation-hub-actions.component';
import { DonationHubDropOffInfoComponent } from './child-components/donation-hub-drop-off-info/donation-hub-drop-off-info.component';
import { DonationHubPledgeActionsComponent } from './child-components/donation-hub-pledge-actions/donation-hub-pledge-actions.component';
import { DonationHubPledgeFormComponent } from './child-components/donation-hub-pledge-form/donation-hub-pledge-form.component';
import { DonationHubPledgeTableComponent } from './child-components/donation-hub-pledge-table/donation-hub-pledge-table.component';
import { DonationHubPledgeTeaserComponent } from './child-components/donation-hub-pledge-teaser/donation-hub-pledge-teaser.component';
import { DonationHubTeaserComponent } from './child-components/donation-hub-teaser/donation-hub-teaser.component';
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

@NgModule({
  declarations: [
    DonationHubComponent,
    DonationHubActionsComponent,
    DonationHubCreateComponent,
    DonationHubDropOffInfoComponent,
    DonationHubEditComponent,
    DonationHubListComponent,
    DonationHubPledgeComponent,
    DonationHubPledgeCreateComponent,
    DonationHubPledgeEditComponent,
    DonationHubTeaserComponent,
    DonationHubPledgeTableComponent,
    DonationHubPledgeActionsComponent,
    DonationHubPledgeListComponent,
    DonationHubPledgeTeaserComponent,
    DonationHubPledgeFormComponent,
    DonationHubPortalComponent,
  ],
  imports: [
    DonationHubRoutingModule,
    CommonModule,
    IonicModule,
    AccountSharedModule,
    DateTimeModule,
    PageListModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
    TableModule,
  ]
})
export class DonationHubModule {}
