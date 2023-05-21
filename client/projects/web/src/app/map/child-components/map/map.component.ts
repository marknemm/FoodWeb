import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Directions, Donation } from '~shared';
import { RenderPolyline } from '~web/map/services/directions/directions.service';
import { MapOptionsForm, MapOptionsFormAdapter } from '~web/map/services/map-options-form-adapter/map-options-form-adapter.service';
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

  readonly optionsForm: MapOptionsForm = this._mapOptionsFormAdapter.toForm();

  private _destroy$ = new Subject<void>();
  private _selWaypointMarker: WaypointMarker;

  constructor(
    private _mapOptionsFormAdapter: MapOptionsFormAdapter,
    private _mapService: MapService,
  ) {}

  get directions(): Directions {
    return this._mapService.directions;
  }

  get directionsHref(): string {
    return this._mapService.directionsHref;
  }

  get mapCenter(): google.maps.LatLng {
    return this._mapService.mapCenter;
  }

  get mapPolylines(): RenderPolyline[] {
    return this._mapService.mapPolylines;
  }

  get selWaypointMarker(): WaypointMarker {
    return this._selWaypointMarker;
  }

  get waypointMarkers(): WaypointMarker[] {
    return this._mapService.waypointMarkers;
  }

  ngOnInit(): void {
    this.optionsForm.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((options: MapOptions) =>
      this.refreshMap(options)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  ngOnDestroy(): void {
    this._destroy$.next(); // Prevent rxjs memory leaks.
  }

  refreshMap(options: MapOptions): void {
    setTimeout(() => // Wait until we are sure view is fully initialized to access map ViewChild.
      this._mapService.refreshMap(this.map, this.donation, options)
    );
  }

  openInfoWindow(marker: MapMarker, waypointMarker: WaypointMarker): void {
    this._selWaypointMarker = waypointMarker;
    this.infoWindow.open(marker);
  }
}
