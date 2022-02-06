import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatExpansionModule } from '@angular/material/expansion';
import { IonicModule } from '@ionic/angular';
import { MapModule as WebMapModule } from '~web/map/map.module';
import { CurrentLocationService as WebCurrentLocationService } from '~web/map/services/current-location/current-location.service';
import { DirectionStepsComponent } from './child-components/direction-steps/direction-steps.component';
import { MapOptionsComponent } from './child-components/map-options/map-options.component';
import { MapComponent } from './child-components/map/map.component';
import { CurrentLocationService } from './services/current-location/current-location.service';

@NgModule({
  declarations: [
    MapComponent,
    MapOptionsComponent,
    DirectionStepsComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    IonicModule,
    MatExpansionModule,
    ReactiveFormsModule,
    WebMapModule,
  ],
  exports: [
    WebMapModule,
    MapComponent,
  ]
})
export class MapModule {

  static forRoot(): ModuleWithProviders<MapModule> {
    return {
      ngModule: MapModule,
      providers: [
        // In base web code, anywhere where AlertService is provided, provide Hybrid AlertService instead.
        { provide: WebCurrentLocationService, useExisting: CurrentLocationService },
      ]
    }
  }
}
