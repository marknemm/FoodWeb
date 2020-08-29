import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-event-card',
  templateUrl: './admin-event-card.component.html',
  styleUrls: ['./admin-event-card.component.scss'],
})
export class AdminEventCardComponent implements OnInit {

  @Input() featuredEvent: FeaturedEvent;
  @Input() hideActions = false;
  @Input() hideDelete = false;
  @Input() hideEdit = false;
  @Input() hideViewRegistrations = false;
  @Input() linkToEventsPage = false;

  @Output() deleteEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

}
