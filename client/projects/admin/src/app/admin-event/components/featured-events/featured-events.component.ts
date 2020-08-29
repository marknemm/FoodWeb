import { Component, OnInit } from '@angular/core';
import { DeleteFeaturedEventService } from '~admin/admin-event/services/delete-featured-event/delete-featured-event.service';
import { FeaturedEvent } from '~shared';
import { FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';

@Component({
  selector: 'foodweb-admin-featured-events',
  templateUrl: './featured-events.component.html',
  styleUrls: ['./featured-events.component.scss'],
})
export class FeaturedEventsComponent implements OnInit {

  private _featuredEvents: FeaturedEvent[] = [];

  constructor(
    private _featuredEventsService: FeaturedEventsService,
    private _deleteFeaturedEventService: DeleteFeaturedEventService
  ) {}

  get featuredEvents(): FeaturedEvent[] {
    return this._featuredEvents;
  }

  ngOnInit() {
    this._featuredEventsService.getFeaturedEvents().subscribe(
      (featuredEvents: FeaturedEvent[]) => this._featuredEvents = featuredEvents
    );
  }

  deleteEvent(featuredEvent: FeaturedEvent, idx: number): void {
    this._deleteFeaturedEventService.deleteEvent(featuredEvent).subscribe(
      () => this._featuredEvents.splice(idx, 1)
    );
  }

}
