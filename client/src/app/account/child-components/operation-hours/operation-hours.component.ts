import { Component, OnInit, OnChanges, Input, Optional, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypedFormControl } from '../../../data-structure/typed-form-control';
import { OperationHoursInfoForm } from '../../forms/operation-hours-info.form';
import { OperationHoursArray } from '../../forms/operation-hours.array';
import { OperationHoursForm } from '../../forms/operation-hours.form';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../../date-time/services/date-time/date-time.service';
import { FormHelperService } from '../../../shared/services/form-helper/form-helper.service';
import { OperationHours } from '../../../../../../shared/src/interfaces/account/operation-hours';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss']
})
export class OperationHoursComponent implements OnInit, OnChanges, OnDestroy {

  @Input() editing = false;
  @Input() operationHoursArr: OperationHours[] = [];
  @Input() formGroupName: string;
  @Input() formGroup: OperationHoursInfoForm;

  private _operationHoursGridHeight: number;
  private _operationHoursGridOpacity: number;
  private _formFieldTabIndex: number;
  private _destroy$ = new Subject();

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    public confirmDialogService: ConfirmDialogService,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  get operationHoursFormArr(): OperationHoursArray {
    return <OperationHoursArray>this.formGroup.get('operationHours');
  }

  get operationHoursLimited(): boolean {
    const limitedOpHoursCtrl = <TypedFormControl<boolean>>this.formGroup.get('limitOperationHours');
    return limitedOpHoursCtrl ? limitedOpHoursCtrl.value : false;
  }

  get operationHoursGridHeight(): number {
    return this._operationHoursGridHeight;
  }

  get operationHoursGridOpacity(): number {
    return this._operationHoursGridOpacity;
  }

  get formFieldTabIndex(): number {
    return this._formFieldTabIndex;
  }

  ngOnInit() {
    this.formGroup = <OperationHoursInfoForm>this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    if (this.operationHoursArr && this.operationHoursArr.length > 0) {
      this.formGroup.patchValue(this.operationHoursArr);
    }
    this._recalcOperationHoursGridStyles = this._recalcOperationHoursGridStyles.bind(this);
    this.formGroup.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(this._recalcOperationHoursGridStyles);
    window.addEventListener('resize', this._recalcOperationHoursGridStyles);
    this._recalcOperationHoursGridStyles();
  }

  private _recalcOperationHoursGridStyles(): void {
    const numEntries: number = this.formGroup.get('operationHours').value.length;
    this._operationHoursGridHeight = (this.editing && this.operationHoursLimited)
      ? (window.innerWidth > 991)
        ? (Math.ceil(numEntries / 2) * 84)
        : (window.innerWidth > 410)
          ? (numEntries * 84)
          : (numEntries * 130)
      : 0;
    this._operationHoursGridOpacity = (this._operationHoursGridHeight > 0) ? 1 : 0;
    this._formFieldTabIndex = (this._operationHoursGridHeight > 0) ? 0 : -1;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing) {
      setTimeout(() => this._recalcOperationHoursGridStyles());
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    window.removeEventListener('resize', this._recalcOperationHoursGridStyles);
  }

  getDefaultStartTime(operationHoursForm: OperationHoursForm): string {
    const curStartTimeVal: string = operationHoursForm.get('startTime').value;
    return (curStartTimeVal)
      ? curStartTimeVal
      : '9:00 AM';
  }

  getDefaultEndTime(operationHoursForm: OperationHoursForm): string {
    const curEndTimeVal: string = operationHoursForm.get('endTime').value;
    return (curEndTimeVal)
      ? curEndTimeVal
      : '5:00 PM';
  }
}
