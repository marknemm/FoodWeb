import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from './../../login/login.component';
import { SessionService } from './../../../services/session/session.service';
import { PageTitleService } from './../../../services/page-title/page-title.service';
import { LeftNavService } from './../../../services/left-nav/left-nav.service';
import { PageProgressService } from './../../../services/page-progress/page-progress.service';

@Component({
  selector: 'food-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [PageTitleService]
})
export class HeaderComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public pageTitleService: PageTitleService,
    public pageProgressService: PageProgressService,
    public leftNavService: LeftNavService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {}

  login(): void {
    this._matDialog.open(LoginComponent);
  }

}
