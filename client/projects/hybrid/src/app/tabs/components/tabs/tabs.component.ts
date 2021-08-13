import { Component, OnInit } from '@angular/core';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnInit(): void {}

}
