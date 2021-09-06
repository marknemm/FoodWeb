import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('sidenavContent', { static: true }) sidnavContent: MatSidenavContent;

  /**
   * A maximum width in pixels. When set, determines that when the window width is equal to or lower,
   * the leftnav will be in over mode. Otherwise, it will be in side mode.
   * If not set, then the leftnav will always be in over mode.
   */
  @Input() windowSizeThreshPx: number;

  constructor(
    public pageProgressService: PageProgressService,
    public shellService: ShellService,
    public window: Window,
  ) {}

  get fixedTopGap(): number {
    return (this.window.innerWidth > 990) ? 60 : 40;
  }

  ngOnInit() {
    this.shellService.setMainContent(this.sidnavContent.getElementRef().nativeElement);
  }
}
