import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Directions } from '~web/map/interfaces/map';

@Component({
  selector: 'foodweb-direction-steps',
  templateUrl: './direction-steps.component.html',
  styleUrls: ['./direction-steps.component.scss'],
})
export class DirectionStepsComponent implements OnChanges {

  @Input() directions: Directions;
  @Input() filter: DirectionsFilter;

  private _waypointSegmentIdx: number = null;

  constructor() {}

  get waypointSegmentIdx(): number {
    return this._waypointSegmentIdx;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.directions || changes.filter) {
      switch (this.filter) {
        case 'Donor':
          this._waypointSegmentIdx = 0;
          break;
        case 'Receiver':
          // If we don't have a scheduled delivery yet, then we will have only 1 waypoint segment, and it will be from Donor to Receiver.
          this._waypointSegmentIdx = (this.directions?.waypointSegments.length > 1) ? 1 : 0;
          break;
        default:
          this._waypointSegmentIdx = null; // No direction steps filter.
      }
    }
  }

}

export type DirectionsFilter = 'Donor' | 'Receiver';
