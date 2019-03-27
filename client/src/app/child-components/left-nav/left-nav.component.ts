import { Component, OnInit } from '@angular/core';
import { LeftNavService } from '../../services/left-nav/left-nav.service';
import { PageProgressService } from '../../services/page-progress/page-progress.service';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'food-web-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

  _onNavClick(): void {
    if (this.leftNavService.mode === 'over') {
      this.leftNavService.toggle();
    }
  }
}
