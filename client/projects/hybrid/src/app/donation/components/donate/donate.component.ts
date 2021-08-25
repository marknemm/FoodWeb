import { Component } from '@angular/core';
import { DonateComponent as WebDonateComponent } from '~web/donation/components/donate/donate.component';

@Component({
  selector: 'foodweb-hybrid-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent extends WebDonateComponent {}
