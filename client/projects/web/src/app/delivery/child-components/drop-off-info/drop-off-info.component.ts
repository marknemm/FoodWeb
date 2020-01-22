import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeRange, DeliveryHelper, Donation } from '~shared';

@Component({
  selector: 'food-web-drop-off-info',
  templateUrl: './drop-off-info.component.html',
  styleUrls: ['./drop-off-info.component.scss'],
})
export class DropOffInfoComponent implements OnChanges {

  @Input() donation: Donation;

  private _dropOffWindow: DateTimeRange;

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  get dropOffWindow(): DateTimeRange {
    return this._dropOffWindow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donation) {
      this._dropOffWindow = this._deliveryHelper.getDropOffWindow(this.donation);
    }
  }

}
