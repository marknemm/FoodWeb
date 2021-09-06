import { Component } from '@angular/core';
import { DonationWorkflowComponent as WebDonationWorkflowComponent } from '~web/donation-shared/child-components/donation-workflow/donation-workflow.component';

@Component({
  selector: 'foodweb-hybrid-donation-workflow',
  templateUrl: './donation-workflow.component.html',
  styleUrls: ['./donation-workflow.component.scss']
})
export class DonationWorkflowComponent extends WebDonationWorkflowComponent {}
