import { Component } from '@angular/core';
import { DeleteFeaturedEventService } from '~admin/admin-event/services/delete-featured-event/delete-featured-event.service';
import { FeaturedEvent } from '~shared';
import { EventsComponent } from '~web/event/components/events/events.component';
import { FeaturedEventsService } from '~web/event/services/featured-events/featured-events.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
})
export class AdminEventsComponent extends EventsComponent {

  constructor(
    featuredEventsService: FeaturedEventsService,
    pageTitleService: PageTitleService,
    private _deleteFeaturedEventService: DeleteFeaturedEventService
  ) {
    super(pageTitleService, featuredEventsService);
  }

  deleteEvent(event: FeaturedEvent, idx: number): void {
    this._deleteFeaturedEventService.deleteEvent(event).subscribe(
      () => this.events.splice(idx, 1)
    );
  }

}
