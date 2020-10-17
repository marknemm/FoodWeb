import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
