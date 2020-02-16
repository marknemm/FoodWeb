import { Component, OnInit } from '@angular/core';
import { CreateFeaturedEventService } from '~admin/admin-event/create-featured-event/create-featured-event.service';
import { FeaturedEvent } from '~shared';

@Component({
  selector: 'food-web-create-featured-event',
  templateUrl: './create-featured-event.component.html',
  styleUrls: ['./create-featured-event.component.scss'],
})
export class CreateFeaturedEventComponent implements OnInit {

  private _createEventComplete = false;

  constructor(
    private _createFeaturedEventService: CreateFeaturedEventService
  ) {}

  get createEventComplete(): boolean {
    return this._createEventComplete;
  }

  ngOnInit() {}

  createEvent(featuredEvent: FeaturedEvent): void {
    this._createFeaturedEventService.createEvent(featuredEvent).subscribe(
      () => this._createEventComplete = true
    );
  }

}
