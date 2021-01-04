import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { AppDirectionStepsComponent } from './child-components/app-direction-steps/app-direction-steps.component';
import { AppMapOptionsComponent } from './child-components/app-map-options/app-map-options.component';
import { AppMapComponent } from './child-components/app-map/app-map.component';

@NgModule({
  declarations: [
    AppDirectionStepsComponent,
    AppMapComponent,
    AppMapOptionsComponent,
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
    AppDirectionStepsComponent,
    AppMapComponent,
    AppMapOptionsComponent
  ]
})
export class AppMapModule {}
