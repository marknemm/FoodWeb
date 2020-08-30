import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  /**
   * A maximum width in pixels. When set, determines that when the window width is equal to or lower,
   * the leftnav will be in over mode. Otherwise, it will be in side mode.
   * If not set, then the leftnav will always be in over mode.
   */
  @Input() windowSizeThreshPx: number;

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService,
    public window: Window,
  ) {}

  ngOnInit() {
    this.leftNavService.initDrawerContent(this.drawerContent);
  }
}
