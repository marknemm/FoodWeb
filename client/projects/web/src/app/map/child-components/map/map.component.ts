import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Donation } from '~shared';
import { MapOptionsForm } from '~web/map/forms/map-options.form';
import { MapOptions, MapService, WaypointMarker } from '~web/map/services/map/map.service';

@Component({
  selector: 'foodweb-map',
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
  @Input() useVolunteerCurrentPos = true;
  @Input() width = '100%';

  @ViewChild(GoogleMap, { static: true }) map: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  optionsForm = new MapOptionsForm();

  private _destroy$ = new Subject();
  private _selWaypointMarker: WaypointMarker;

  constructor(
    public mapService: MapService
  ) {}

  get selWaypointMarker(): WaypointMarker {
    return this._selWaypointMarker;
  }

  ngOnInit() {
    this.optionsForm.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((options: MapOptions) =>
      this.refreshMap(options)
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation || changes.useVolunteerCurrentPos || changes.displayRouteToDonor || changes.displayRouteToReceiver) {
      if (changes.useVolunteerCurrentPos) {
        this.optionsForm.patchValue({ useVolunteerCurrentPos: this.useVolunteerCurrentPos });
      }
      if (changes.displayRouteToDonor) {
        this.optionsForm.patchValue({ displayRouteToDonor: this.displayRouteToDonor });
      }
      if (changes.displayRouteToReceiver) {
        this.optionsForm.patchValue({ displayRouteToReceiver: this.displayRouteToReceiver });
      }

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

  openInfoWindow(marker: MapMarker, waypointMarker: WaypointMarker): void {
    this._selWaypointMarker = waypointMarker;
    this.infoWindow.open(marker);
  }
}
