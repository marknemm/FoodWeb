import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '~web/material.module';

import {
  DateTimeSelectDialogComponent,
  DateTimeComponent,
  DateTimeRangeComponent,
  DateTimeSelectComponent,
  FormatDatePipe,
  FormatDateTimePipe,
  FormatTimePipe
} from '~web/date-time';

@NgModule({
  declarations: [
    DateTimeSelectDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeSelectComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    DateTimeSelectDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeSelectComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe
  ],
  entryComponents: [
    DateTimeSelectDialogComponent
  ]
})
export class DateTimeModule {}
