import { Component, OnInit } from '@angular/core';
import { FeaturedEvent, FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';

@Component({
  selector: 'foodweb-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  private _featuredEvents: FeaturedEvent[] = [];

  constructor(
    private _featuredEventsService: FeaturedEventsService
  ) {}

  get featuredEvents(): FeaturedEvent[] {
    return this._featuredEvents;
  }

  ngOnInit() {
    this._featuredEventsService.getFeaturedEvents().subscribe(
      (featuredEvents: FeaturedEvent[]) => this._featuredEvents = featuredEvents
    );
  }

}
