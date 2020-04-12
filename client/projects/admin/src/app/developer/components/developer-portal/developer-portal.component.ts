import { Component, OnInit } from '@angular/core';
import { DownloadDevDbService } from '~admin/developer/download-dev-db/download-dev-db.service';

@Component({
  selector: 'food-web-developer-portal',
  templateUrl: './developer-portal.component.html',
  styleUrls: ['./developer-portal.component.scss'],
})
export class DeveloperPortalComponent implements OnInit {

  constructor(
    public downloadDevDbService: DownloadDevDbService
  ) {}

  ngOnInit() {}

}
