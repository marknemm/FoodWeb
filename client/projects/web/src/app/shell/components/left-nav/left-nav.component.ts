import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('drawerContent', { static: true }) drawerContent: MatDrawerContent;

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService
  ) {}

  get pageProgressColor(): string {
    return (this.pageProgressService.color || 'accent');
  }

  ngOnInit() {
    this.leftNavService.initDrawerContent(this.drawerContent);
  }
}
