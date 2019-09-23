import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { MapComponent } from './child-components/map/map.component';

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
