import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from '~web-env/environment';

import { MapComponent } from '~web/map';

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
