import { Component, OnInit } from '@angular/core';
import { SessionService } from '~hybrid/session/services/session/session.service';
// import { HomeComponent as WebHomeComponent } from '~web/home/components/home/home.component';

@Component({
  selector: 'foodweb-hybrid-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  get donationHubFeatureVisible(): boolean {
    return (!this.sessionService.isDonor && !this.sessionService.isReceiver);
  }

  ngOnInit(): void {}

}
