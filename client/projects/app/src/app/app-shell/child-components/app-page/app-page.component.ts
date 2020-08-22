import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isAndroid, isIOS, Page } from '@nativescript/core';
import { AppLeftNavService } from '~app/app-shell/services/app-left-nav/app-left-nav.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-app-page',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss']
})
export class AppPageComponent implements OnInit, OnChanges {

  readonly isAndroid: boolean = isAndroid;
  readonly isIOS: boolean = isIOS;

  @Input() hideActionBar = false;
  @Input() pageTitle = 'FoodWeb';

  constructor(
    public leftNavService: AppLeftNavService,
    public pageProgressService: PageProgressService,
    public page: Page
  ) {}

  get showBlockingPageProgress(): boolean {
    return !!(this.pageProgressService.blocking && this.pageProgressService.trigger);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hideActionBar) {
      this.page.actionBarHidden = this.hideActionBar;
    }
  }

}
