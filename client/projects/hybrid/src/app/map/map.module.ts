import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatExpansionModule } from '@angular/material/expansion';
import { IonicModule } from '@ionic/angular';
import { MapModule as WebMapModule } from '~web/map/map.module';
import { MapComponent } from './child-components/map/map.component';

@NgModule({
  declarations: [
    MapComponent
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
export class MapModule {}
