import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() navMenuId = '';
  @Input() navOpened = false;
  @Input() pageTitle = '';
  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  @Output() toggleNavMenu = new EventEmitter<void>();

  constructor(
    public pageProgressService: PageProgressService,
  ) {}
}
