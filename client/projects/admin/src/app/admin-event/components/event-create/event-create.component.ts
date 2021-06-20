import { Component, OnInit } from '@angular/core';
import { EventCreateService } from '~admin/admin-event/services/event-create/event-create.service';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent implements OnInit {

  private _eventCreationComplete = false;
  private _savedEvent: FeaturedEvent;

  constructor(
    private _eventCreateService: EventCreateService
  ) {}

  get eventCreationComplete(): boolean {
    return this._eventCreationComplete;
  }

  get savedEvent(): FeaturedEvent {
    return this._savedEvent;
  }

  ngOnInit() {}

  createEvent(featuredEvent: FeaturedEvent): void {
    this._eventCreateService.createEvent(featuredEvent).subscribe(
      (savedEvent: FeaturedEvent) => {
        this._eventCreationComplete = true;
        this._savedEvent = savedEvent;
      }
    );
  }

}
