import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '~hybrid/shared/shared.module';
import { DateTimeModule as WebDateTimeModule } from '~web/date-time/date-time.module';
import { DateTimeRangeComponent } from './child-components/date-time-range/date-time-range.component';
import { DateTimeComponent } from './child-components/date-time/date-time.component';
import { TimeRangeComponent } from './child-components/time-range/time-range.component';
import { TimeComponent } from './child-components/time/time.component';

@NgModule({
  declarations: [
    DateTimeComponent,
    DateTimeRangeComponent,
    TimeComponent,
    TimeRangeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    WebDateTimeModule,
  ],
  exports: [
    WebDateTimeModule,
    DateTimeComponent,
    DateTimeRangeComponent,
    TimeComponent,
    TimeRangeComponent,
  ]
})
export class DateTimeModule {}
