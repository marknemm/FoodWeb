import { Component, OnInit } from '@angular/core';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { SessionService } from '~web/session/services/session/session.service';
import { FeatureFlagService } from '~web/shared/services/feature-flag/feature-flag.service';

@Component({
  selector: 'foodweb-hybrid-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  private _showDeliveries = false;

  constructor(
    public notificationService: NotificationService,
    public sessionService: SessionService,
    private _featureFlagService: FeatureFlagService
  ) {}

  get showDeliveries(): boolean {
    return this._showDeliveries;
  }

  ngOnInit(): void {
    this._showDeliveries = this._featureFlagService.hasTruthyFeatureFlag('showDeliveries');
  }

}
