import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { SessionService } from '../../services/session/session.service';

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
    const showLogin: boolean = !!this._activatedRoute.snapshot.params['login'];
    if (showLogin && !this._sessionService.loggedIn) {
      this._matDialog.open(LoginComponent);
    }
  }

}
