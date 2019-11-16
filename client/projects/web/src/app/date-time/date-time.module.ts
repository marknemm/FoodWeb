import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '~web/material.module';

import { DateTimeSelectDialogComponent } from '~web/date-time-select-dialog/date-time-select-dialog.component';
import { DateTimeComponent } from '~web/date-time/date-time.component';
import { DateTimeRangeComponent } from '~web/date-time-range/date-time-range.component';
import { DateTimeSelectComponent } from '~web/date-time-select/date-time-select.component';
import { FormatDatePipe } from '~web/format-date/format-date.pipe';
import { FormatDateTimePipe } from '~web/format-date-time/format-date-time.pipe';
import { FormatTimePipe } from '~web/format-time/format-time.pipe';

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
