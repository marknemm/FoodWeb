import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { DirectionsExtractor, MapWaypointConverter } from '~shared';
import { DirectionStepsComponent } from './child-components/direction-steps/direction-steps.component';
import { MapMarkerInfoComponent } from './child-components/map-marker-info/map-marker-info.component';
import { MapOptionsComponent } from './child-components/map-options/map-options.component';
import { MapComponent } from './child-components/map/map.component';
import { DirectionStepsExtractorPipe } from './pipes/direction-steps-extractor/direction-steps-extractor.pipe';

@NgModule({
  declarations: [
    DirectionStepsComponent,
    DirectionStepsExtractorPipe,
    MapComponent,
    MapMarkerInfoComponent,
    MapOptionsComponent,
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  exports: [
    DirectionStepsComponent,
    MapComponent,
    MapOptionsComponent
  ],
  providers: [
    MapWaypointConverter,
    DirectionsExtractor
  ]
})
export class MapModule {}
