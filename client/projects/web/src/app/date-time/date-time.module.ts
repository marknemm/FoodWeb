import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '~web/material.module';
import { DateTimeRangeRadioComponent } from './child-components/date-time-range-radio/date-time-range-radio.component';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { DateComponent } from './child-components/date/date.component';
import { TimeComponent } from './child-components/time/time.component';
import { DateTimeRangeRadioDialogComponent } from './components/date-time-range-radio-dialog/date-time-range-radio-dialog.component';
import { FormatDateTimePipe } from './pipes/format-date-time/format-date-time.pipe';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { FormatTimePipe } from './pipes/format-time/format-time.pipe';

@NgModule({
  declarations: [
    DateComponent,
    DateTimeRangeRadioDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeRangeRadioComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe,
    TimeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    DateComponent,
    DateTimeRangeRadioDialogComponent,
    DateTimeComponent,
    DateTimeRangeComponent,
    DateTimeRangeRadioComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe,
    TimeComponent
  ]
})
export class DateTimeModule {}
