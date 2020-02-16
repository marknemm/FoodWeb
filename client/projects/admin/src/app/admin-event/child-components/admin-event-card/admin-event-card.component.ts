import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'food-web-admin-event-card',
  templateUrl: './admin-event-card.component.html',
  styleUrls: ['./admin-event-card.component.scss'],
})
export class AdminEventCardComponent implements OnInit {

  @Input() featuredEvent: FeaturedEvent;
  @Input() hideActions = false;
  @Input() linkToEventsPage = false;

  @Output() deleteEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

}
