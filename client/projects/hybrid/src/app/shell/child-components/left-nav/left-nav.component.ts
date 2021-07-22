import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { ShellService } from '~hybrid/shell/services/shell/shell.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-hybrid-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('leftNav', { static: true }) leftNav: IonMenu;

  /**
   * A maximum width in pixels. When set, determines that when the window width is equal to or lower,
   * the leftnav will be in over mode. Otherwise, it will be in side mode.
   * If not set, then the leftnav will always be in over mode.
   */
  @Input() windowSizeThreshPx: number;

  constructor(
    public shellService: ShellService,
    public pageProgressService: PageProgressService,
    public window: Window,
  ) {}

  get fixedTopGap(): number {
    return (this.window.innerWidth > 990) ? 60 : 40;
  }

  ngOnInit() {
    this.shellService.initLeftNav(this.leftNav);
  }
}
