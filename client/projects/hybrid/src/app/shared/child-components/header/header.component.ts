import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-hybrid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {

  @Input() defaultBackHref: string;
  @Input() hideBackHref = false;
  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public notificationService: NotificationService,
    public pageProgressService: PageProgressService,
    public sessionService: SessionService,
    private _router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Allow relative default back href.
    if (changes.defaultBackHref && /^(\.\.\/?)+$/.test(this.defaultBackHref)) {
      const backCount: number = this.defaultBackHref.split('/').length;
      this.defaultBackHref = this._router.url.split('/').slice(0, -backCount).join('/');
    }
  }
}
