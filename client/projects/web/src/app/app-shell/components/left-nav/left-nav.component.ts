import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { LeftNavService } from '~web/app-shell/left-nav/left-nav.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

@Component({
  selector: 'food-web-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('drawerContent', { static: true }) drawerContent: MatDrawerContent;

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService
  ) {}

  ngOnInit() {
    this.leftNavService.initDrawerContent(this.drawerContent);
  }
}
