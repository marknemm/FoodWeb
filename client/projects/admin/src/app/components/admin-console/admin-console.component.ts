import { Component, OnInit } from '@angular/core';
import { faCalendarPlus, faClipboardList, faGifts } from '@fortawesome/free-solid-svg-icons';
import { ConstantsService } from '~web/shared/constants/constants.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'food-web-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent implements OnInit {

  readonly faCalendarPlus = faCalendarPlus;
  readonly faClipboardList = faClipboardList;
  readonly faGifts = faGifts;

  constructor(
    public constantsService: ConstantsService,
    private _pageTitleService: PageTitleService
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Admin Console';
  }

}
