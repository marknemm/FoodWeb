import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DateTimeRangeComponent } from '~web/date-time/date-time-range/date-time-range.component';
import { DateTimeSelectDialogComponent } from '~web/date-time/date-time-select-dialog/date-time-select-dialog.component';
import { DateTimeSelectComponent } from '~web/date-time/date-time-select/date-time-select.component';
import { DateTimeComponent } from '~web/date-time/date-time/date-time.component';
import { FormatDateTimePipe } from '~web/date-time/format-date-time/format-date-time.pipe';
import { FormatDatePipe } from '~web/date-time/format-date/format-date.pipe';
import { FormatTimePipe } from '~web/date-time/format-time/format-time.pipe';
import { MaterialModule } from '~web/material.module';

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
