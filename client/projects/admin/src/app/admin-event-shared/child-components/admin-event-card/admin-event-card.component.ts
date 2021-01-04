import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeaturedEvent } from '~shared';
import { Convert } from '~web/component-decorators';

@Component({
  selector: 'foodweb-admin-event-card',
  templateUrl: './admin-event-card.component.html',
  styleUrls: ['./admin-event-card.component.scss'],
})
export class AdminEventCardComponent implements OnInit {

  @Input() featuredEvent: FeaturedEvent;
  @Convert()
  @Input() hideActions = false;
  @Convert()
  @Input() hideDelete = false;
  @Convert()
  @Input() hideEdit = false;
  @Convert()
  @Input() hideViewRegistrations = false;
  @Convert()
  @Input() linkToEventsPage = false;

  @Output() deleteEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

}
