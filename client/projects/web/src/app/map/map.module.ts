import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from '~web/environment';

import { MapComponent } from '~web/map/map.component';

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
