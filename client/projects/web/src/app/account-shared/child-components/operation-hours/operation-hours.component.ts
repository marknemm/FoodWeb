import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { OperationHours, Weekday } from '~shared';
import { OperationHoursForm, OperationHoursFormAdapter, OperationHoursFormData } from '~web/account-shared/services/operation-hours-form-adapter/operation-hours-form-adapter.service';
import { FormFieldProviders, FormFieldService  } from '~web/forms';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss'],
  providers: [FormFieldProviders]
})
export class OperationHoursComponent implements OnInit {

  @Input() editable = false;
  @Input() get value(): OperationHours[]        { return this._formFieldService.valueOut(); }
           set value(opHours: OperationHours[]) { this._formFieldService.valueIn(opHours); }

  @HostBinding()
  readonly class = 'foodweb-operation-hours';

  constructor(
    public constantsService: ConstantsService,
    private _formFieldService: FormFieldService<OperationHoursFormData, OperationHoursForm, OperationHours[]>,
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
      genDefault: () => this._operationHoursFormAdapter.toForm(),
      valueInConverter: (opHours: OperationHours[]) => this._operationHoursFormAdapter.toViewModel(opHours),
      valueOutConverter: (opHoursData: OperationHoursFormData) => this._operationHoursFormAdapter.toModel(opHoursData)
    });
  }

  doesWeekdayHaveHours(weekday: Weekday): boolean {
    return (this.operationHoursForm.value[weekday].length > 0);
  }

}
