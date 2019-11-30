import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '~web/environments/environment';
import { MapComponent } from '~web/map/map/map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleMapsJSApiKey }),
  ],
  exports: [
    AgmCoreModule,
    MapComponent
  ]
})
export class MapModule {}
