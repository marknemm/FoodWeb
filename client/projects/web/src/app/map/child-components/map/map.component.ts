import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Donation } from '~shared';
import { MapOptionsForm } from '~web/map/forms/map-options.form';
import { MapOptions, MapService } from '~web/map/map/map.service';

@Component({
  selector: 'food-web-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MapService]
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  @Input() displayMapOnly = false;
  @Input() displayRouteToDonor = true;
  @Input() displayRouteToReceiver = true;
  @Input() donation: Donation;
  @Input() height = '300px';
  @Input() options: google.maps.MapOptions = {};
  @Input() useVolunteerCurrentPos = false;
  @Input() width = '100%';

  @ViewChild(GoogleMap, { static: true }) map: GoogleMap;

  optionsForm = new MapOptionsForm();

  private _destroy$ = new Subject();

  constructor(
    public mapService: MapService
  ) {}

  ngOnInit() {
    this.optionsForm.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((options: MapOptions) =>
      this.refreshMap(options)
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation || changes.useVolunteerCurrentPos || changes.displayRouteToDonor || changes.displayRouteToReceiver) {
      this.refreshMap({
        displayRouteToDonor: this.displayRouteToDonor,
        displayRouteToReceiver: this.displayRouteToReceiver,
        useVolunteerCurrentPos: this.useVolunteerCurrentPos
      });
    }
  }

  ngOnDestroy() {
    this._destroy$.next(); // Prevent rxjs memory leaks.
  }

  refreshMap(options: MapOptions): void {
    setTimeout(() => // Wait until we are sure view is fully initialized to access map ViewChild.
      this.mapService.refreshMap(this.map, this.donation, options)
    );
  }
}
