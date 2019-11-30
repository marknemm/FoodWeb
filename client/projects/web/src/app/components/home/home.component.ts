import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoginDialogComponent } from '~web/session/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/session/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _sessionService: SessionService
  ) {}

  ngOnInit() {
    if (!!this._activatedRoute.snapshot.params['login']) {
      LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog);
    }
  }

}
