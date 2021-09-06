import { Component, Input } from '@angular/core';
import { OperationHoursForm } from '~web/account-shared/forms/operation-hours.form';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: formProvider(OperationHoursComponent)
})
export class OperationHoursComponent extends FormBaseComponent<OperationHoursForm> {

  @Input() allowClear = false;
  @Input() minutesGap = 5;
  @Input() allowOverlayClick = false;
  @Input() timeWidth = '110px';
  @Input() weekdayPadding = '0 20px 0 0';
  @Input() weekdayWidth = '125px';

  constructor(
    public constantsService: ConstantsService,
    formHelperService: FormHelperService
  ) {
    super(() => new OperationHoursForm(), formHelperService);
  }

  get defaultStartTime(): string {
    return (this.formGroup.startTime ? this.formGroup.startTime : '9:00 AM');
  }

  get defaultEndTime(): string  {
    return (this.formGroup.endTime ? this.formGroup.endTime : '5:00 PM');
  }
}
