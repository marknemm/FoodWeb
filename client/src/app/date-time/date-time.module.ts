import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { DateTimeSelectDialogComponent } from './components/date-time-select-dialog/date-time-select-dialog.component';

import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { DateTimeSelectComponent } from './child-components/date-time-select/date-time-select.component';

import { FormatDatePipe } from './pipes/format-date/format-date.pipe';
import { FormatDateTimePipe } from './pipes/format-date-time/format-date-time.pipe';
import { FormatTimePipe } from './pipes/format-time/format-time.pipe';

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
