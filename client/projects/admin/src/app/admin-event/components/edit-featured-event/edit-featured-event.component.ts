import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteFeaturedEventService } from '~admin/admin-event/services/delete-featured-event/delete-featured-event.service';
import { ReadFeaturedEventService } from '~admin/admin-event/services/read-featured-event/read-featured-event.service';
import { UpdateFeaturedEventService } from '~admin/admin-event/services/update-featured-event/update-featured-event.service';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'foodweb-admin-edit-featured-event',
  templateUrl: './edit-featured-event.component.html',
  styleUrls: ['./edit-featured-event.component.scss'],
})
export class EditFeaturedEventComponent implements OnInit {

  private _featuredEvent: FeaturedEvent;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _deleteFeaturedEventService: DeleteFeaturedEventService,
    private _readFeaturedEventService: ReadFeaturedEventService,
    private _router: Router,
    private _updateFeaturedEventService: UpdateFeaturedEventService
  ) {}

  get featuredEvent(): FeaturedEvent {
    return this._featuredEvent;
  }

  ngOnInit() {
    this._readFeaturedEventService.listenFeaturedEventQueryChange(this._activatedRoute).subscribe(
      (featuredEvent: FeaturedEvent) => this._featuredEvent = featuredEvent
    );
  }

  saveEvent(featuredEventToSave: FeaturedEvent): void {
    this._updateFeaturedEventService.updateEvent(featuredEventToSave).subscribe(
      (featuredEvent: FeaturedEvent) => this._featuredEvent = featuredEvent
    );
  }

  deleteEvent(): void {
    this._deleteFeaturedEventService.deleteEvent(this.featuredEvent).subscribe(
      () => this._router.navigate(['/event/list'])
    );
  }

}
