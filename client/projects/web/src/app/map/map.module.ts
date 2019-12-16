import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapWaypointConverter } from '~shared';
import { MapComponent } from '~web/map/map/map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  exports: [
    MapComponent
  ],
  providers: [
    google.maps.DirectionsService,
    MapWaypointConverter
  ]
})
export class MapModule {}
