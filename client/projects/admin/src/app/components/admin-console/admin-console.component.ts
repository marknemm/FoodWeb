import { Component, OnInit } from '@angular/core';
import { faCalendarPlus, faClipboardList, faGifts } from '@fortawesome/free-solid-svg-icons';
import { DownloadDevDbService } from '~admin/developer/download-dev-db/download-dev-db.service';
import { ConstantsService } from '~web/shared/constants/constants.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent implements OnInit {

  readonly faCalendarPlus = faCalendarPlus;
  readonly faClipboardList = faClipboardList;
  readonly faGifts = faGifts;

  constructor(
    public constantsService: ConstantsService,
    public downloadDevDbService: DownloadDevDbService,
    private _pageTitleService: PageTitleService
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Admin Console';
  }

}
