import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
