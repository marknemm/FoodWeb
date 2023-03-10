import { Component, OnInit } from '@angular/core';
import { FeaturedEvent, EventReadService } from '~web/event/services/event-read/event-read.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  private _events: FeaturedEvent[] = [];
  private _eventsNotFound = false;

  constructor(
    public shellService: ShellService,
    private _eventReadService: EventReadService
  ) {
    this.shellService.pageTitle = 'Featured Events';
  }

  get eventsNotFound(): boolean {
    return this._eventsNotFound;
  }

  get events(): FeaturedEvent[] {
    return this._events;
  }

  ngOnInit() {
    this._eventReadService.getEvents().subscribe(
      (events: FeaturedEvent[]) => {
        this._events = events;
        this._eventsNotFound = (this.events.length === 0);
      }
    );
  }

}
