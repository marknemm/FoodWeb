import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateTimeRangeRadioDialogComponent } from '~web/date-time/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { DateTimeRangeRadioComponent } from '~web/date-time/date-time-range-radio/date-time-range-radio.component';
import { DateTimeRangeComponent } from '~web/date-time/date-time-range/date-time-range.component';
import { DateTimeComponent } from '~web/date-time/date-time/date-time.component';
import { FormatDateTimePipe } from '~web/date-time/format-date-time/format-date-time.pipe';
import { FormatDatePipe } from '~web/date-time/format-date/format-date.pipe';
import { FormatTimePipe } from '~web/date-time/format-time/format-time.pipe';
import { MaterialModule } from '~web/material.module';

@NgModule({
  declarations: [
    DateTimeRangeRadioDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeRangeRadioComponent,
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
    DateTimeRangeRadioDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeRangeRadioComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe
  ]
})
export class DateTimeModule {}
