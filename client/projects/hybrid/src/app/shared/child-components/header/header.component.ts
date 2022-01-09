import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { PageProgressService } from '~hybrid/shared/services/page-progress/page-progress.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { UnwrapHostService } from '~web/shared/services/unwrap-host/unwrap-host.service';

@Component({
  selector: 'foodweb-hybrid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [UnwrapHostService]
})
export class HeaderComponent implements OnChanges, OnInit {

  @Input() class = '';
  @Input() defaultBackHref: string;
  @Input() hideBackHref = false;
  @Input() backText = 'Back';
  @Input() ngClass: {[cssClass: string]: boolean};
  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public notificationService: NotificationService,
    public pageProgressService: PageProgressService,
    public sessionService: SessionService,
    private _unwrapHostService: UnwrapHostService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this._unwrapHostService.unwrap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Allow relative default back href.
    if (changes.defaultBackHref && /^(\.\.\/?)+$/.test(this.defaultBackHref)) {
      const backCount: number = this.defaultBackHref.split('/').length;
      this.defaultBackHref = this._router.url.split('/').slice(0, -backCount).join('/');
    }
  }
}
