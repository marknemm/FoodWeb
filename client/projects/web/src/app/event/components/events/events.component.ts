import { Component, OnInit } from '@angular/core';
import { FeaturedEvent, FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  private _events: FeaturedEvent[] = [];
  private _eventsNotFound = false;

  constructor(
    public pageTitleService: PageTitleService,
    private _featuredEventsService: FeaturedEventsService
  ) {}

  get eventsNotFound(): boolean {
    return this._eventsNotFound;
  }

  get events(): FeaturedEvent[] {
    return this._events;
  }

  ngOnInit() {
    this.pageTitleService.title = 'Featured Events';
    this._featuredEventsService.getFeaturedEvents().subscribe(
      (featuredEvents: FeaturedEvent[]) => {
        this._events = featuredEvents;
        this._eventsNotFound = (this.events.length === 0);
      }
    );
  }

}
