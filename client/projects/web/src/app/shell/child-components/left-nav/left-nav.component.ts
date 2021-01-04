import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { Convert } from '~web/component-decorators';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

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
  @Convert()
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
