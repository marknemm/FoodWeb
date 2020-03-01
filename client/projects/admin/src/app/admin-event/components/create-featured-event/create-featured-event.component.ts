import { Component, OnInit } from '@angular/core';
import { CreateFeaturedEventService } from '~admin/admin-event/create-featured-event/create-featured-event.service';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'food-web-create-featured-event',
  templateUrl: './create-featured-event.component.html',
  styleUrls: ['./create-featured-event.component.scss'],
})
export class CreateFeaturedEventComponent implements OnInit {

  private _eventCreateComplete = false;
  private _savedFeaturedEvent: FeaturedEvent;

  constructor(
    private _createFeaturedEventService: CreateFeaturedEventService
  ) {}

  get eventCreateComplete(): boolean {
    return this._eventCreateComplete;
  }

  get savedFeaturedEvent(): FeaturedEvent {
    return this._savedFeaturedEvent;
  }

  ngOnInit() {}

  createEvent(featuredEvent: FeaturedEvent): void {
    this._createFeaturedEventService.createEvent(featuredEvent).subscribe(
      (savedFeaturedEvent: FeaturedEvent) => {
        this._eventCreateComplete = true;
        this._savedFeaturedEvent = savedFeaturedEvent;
      }
    );
  }

}
