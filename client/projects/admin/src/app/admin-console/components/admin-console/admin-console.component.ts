import { Component, OnInit } from '@angular/core';
import { faCalendarPlus, faClipboardList, faGifts } from '@fortawesome/free-solid-svg-icons';
import { DownloadDevDbService } from '~admin/developer/services/download-dev-db/download-dev-db.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

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
    public downloadDevDbService: DownloadDevDbService
  ) {}

  ngOnInit() {}

}
