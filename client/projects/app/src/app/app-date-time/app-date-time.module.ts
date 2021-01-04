import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { AppSharedModule } from '~app/app-shared/app-shared.module';
import { FormatDateTimePipe } from '~web/date-time/pipes/format-date-time/format-date-time.pipe';
import { FormatDatePipe } from '~web/date-time/pipes/format-date/format-date.pipe';
import { FormatTimePipe } from '~web/date-time/pipes/format-time/format-time.pipe';
import { AppDateDialogComponent } from './child-components/app-date-dialog/app-date-dialog.component';
import { AppDateTimeRangeComponent } from './child-components/app-date-time-range/app-date-time-range.component';
import { AppDateTimeComponent } from './child-components/app-date-time/app-date-time.component';
import { AppDateComponent } from './child-components/app-date/app-date.component';
import { AppTimeDialogComponent } from './child-components/app-time-dialog/app-time-dialog.component';
import { AppTimeRangeComponent } from './child-components/app-time-range/app-time-range.component';
import { AppTimeComponent } from './child-components/app-time/app-time.component';

@NgModule({
  declarations: [
    AppDateComponent,
    AppDateDialogComponent,
    AppDateTimeComponent,
    AppDateTimeRangeComponent,
    AppTimeComponent,
    AppTimeRangeComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe,
    AppTimeDialogComponent,
  ],
  imports: [
    AppSharedModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppDateComponent,
    AppDateTimeComponent,
    AppDateTimeRangeComponent,
    AppTimeComponent,
    AppTimeRangeComponent,
    FormatDatePipe,
    FormatDateTimePipe,
    FormatTimePipe,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppDateTimeModule {}
