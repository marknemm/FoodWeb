import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDeleteService } from '~admin/admin-event/services/event-delete/event-delete.service';
import { EventReadService } from '~admin/admin-event/services/event-read/event-read.service';
import { EventUpdateService } from '~admin/admin-event/services/event-update/event-update.service';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {

  private _event: FeaturedEvent;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _eventDelete: EventDeleteService,
    private _eventReadService: EventReadService,
    private _router: Router,
    private _eventUpdatedService: EventUpdateService
  ) {}

  get event(): FeaturedEvent {
    return this._event;
  }

  ngOnInit() {
    this._eventReadService.listenEventQueryChange(this._activatedRoute).subscribe(
      (event: FeaturedEvent) => this._event = event
    );
  }

  saveEvent(eventToSave: FeaturedEvent): void {
    this._eventUpdatedService.updateEvent(eventToSave).subscribe(
      (event: FeaturedEvent) => this._event = event
    );
  }

  deleteEvent(): void {
    this._eventDelete.deleteEvent(this.event).subscribe(
      () => this._router.navigate(['/event/list'])
    );
  }

}
