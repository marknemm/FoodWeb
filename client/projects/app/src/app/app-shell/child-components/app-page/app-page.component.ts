import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { isAndroid, isIOS, Page } from '@nativescript/core';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';
import { Convert } from '~web/component-decorators';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss']
})
export class AppPageComponent implements OnInit, OnChanges {

  readonly isAndroid: boolean = isAndroid;
  readonly isIOS: boolean = isIOS;

  @Convert()
  @Input() hideActionBar: boolean = false;
  @Input() pageTitle = 'FoodWeb';

  @HostBinding() readonly class = 'app-page';

  constructor(
    public leftNavService: AppLeftNavService,
    public page: Page,
    public pageProgressService: PageProgressService,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hideActionBar) {
      this.page.actionBarHidden = this.hideActionBar;
    }
  }

}
