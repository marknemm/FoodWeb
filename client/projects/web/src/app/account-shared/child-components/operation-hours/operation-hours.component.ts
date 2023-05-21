import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { OperationHoursForm, OperationHoursFormAdapter, OperationHoursFormData } from '~web/account-shared/services/operation-hours-form-adapter/operation-hours-form-adapter.service';
import { FormFieldService } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: [FormFieldService]
})
export class OperationHoursComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): OperationHours[]        { return this._operationHoursFormAdapter.toModel(this.operationHoursForm); }
           set value(opHours: OperationHours[]) { this.operationHoursForm.patchValue(
                                                    this._operationHoursFormAdapter.toViewModel(opHours), { emitEvent: false }); }

  @HostBinding()
  readonly class = 'foodweb-operation-hours';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursFormData, OperationHoursForm>,
    private _operationHoursFormAdapter: OperationHoursFormAdapter,
  ) {}

  get operationHoursForm(): OperationHoursForm {
    return this._formFieldService.control;
  }

  get timeRangeCount(): number {
    let count = 0;
    for (const weekday of this.constantsService.WEEKDAYS) {
      count += (this.operationHoursForm.value[weekday]?.length ?? 0);
    }
    return count;
  }

  get limitOperationHours(): boolean {
    return this.operationHoursForm.value.limitOperationHours;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => this._operationHoursFormAdapter.toForm()
    });
  }

  doesWeekdayHaveHours(weekday: Weekday): boolean {
    return (this.operationHoursForm.value[weekday].length > 0);
  }

}
