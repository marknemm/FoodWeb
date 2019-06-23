import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ConstantsService } from '../../services/constants/constants.service';
import { ConfirmDialogService } from '../../services/confirm-dialog/confirm-dialog.service';
import { DateTimeService } from '../../services/date-time/date-time.service';
import { FormHelperService } from '../../services/form-helper/form-helper.service';
import { FlexFormArray } from '../../etc/flex-form-array';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss']
})
export class OperationHoursComponent implements OnInit {

  @Input() editing = false;
  @Input() formArray: FlexFormArray;
  @Input() formArrayName: string;

  timeFieldErrStateMatcher: ErrorStateMatcher;

  constructor(
    public constantsService: ConstantsService,
    public dateTimeService: DateTimeService,
    private _formGroupDirective: FormGroupDirective,
    private _formBuilder: FormBuilder,
    private _formHelperService: FormHelperService,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.formArray = (this._formHelperService.deriveFormArray(this.formArray, this.formArrayName, this._formGroupDirective) as FlexFormArray);
    if (!(this.formArray instanceof FlexFormArray)) {
      this.formArray = new FlexFormArray([]);
    }
    if (!this.formArray.memberTmpl) {
      this.formArray.memberTmpl = this._formBuilder.group(
        {
          id: undefined,
          weekday: ['', Validators.required],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required]
        },
        { validators: this.dateTimeService.genTimeRangeOrderValidator('startTime', 'endTime') }
      );
    }
    if (this._formGroupDirective.form && this.formArrayName) {
      this._formGroupDirective.form.setControl(this.formArrayName, this.formArray);
    }
    this.timeFieldErrStateMatcher = this.dateTimeService.genTimeRangeErrStateMatcher('startTime', 'endTime');
  }

  addOperationHours(): void {
    this.formArray.push({ weekday: '', startTime: '', endTime: '' });
  }

  removeOperationHours(idx: number): void {
    if (this.formArray.at(idx).valid) {
      const confirmMsg = 'Are you sure you wish to delete the operation hours?';
      this._confirmDialogService.displayConfirmDialog(confirmMsg, 'Confirm Delete').subscribe(
        (confirm: boolean) => {
          if (confirm) {
            this.formArray.removeAt(idx);
          }
        }
      );
    } else {
      this.formArray.removeAt(idx);
    }
  }
}
