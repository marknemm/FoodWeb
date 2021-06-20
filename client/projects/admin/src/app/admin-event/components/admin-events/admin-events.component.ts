import { Component } from '@angular/core';
import { EventDeleteService } from '~admin/admin-event/services/event-delete/event-delete.service';
import { FeaturedEvent } from '~shared';
import { EventsComponent } from '~web/event/components/events/events.component';
import { EventReadService } from '~web/event/services/event-read/event-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
})
export class AdminEventsComponent extends EventsComponent {

  constructor(
    eventReadService: EventReadService,
    pageTitleService: PageTitleService,
    private _eventDelete: EventDeleteService
  ) {
    super(pageTitleService, eventReadService);
  }

  deleteEvent(event: FeaturedEvent, idx: number): void {
    this._eventDelete.deleteEvent(event).subscribe(
      () => this.events.splice(idx, 1)
    );
  }

}
