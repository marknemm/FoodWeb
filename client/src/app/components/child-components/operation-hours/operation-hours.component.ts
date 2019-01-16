import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { ConfirmDialogService } from '../../../services/confirm-dialog/confirm-dialog.service';
import { OperationHoursValidationService } from '../../../services/operation-hours-validation/operation-hours-validation.service';
import { FormHelperService } from '../../../services/form-helper/form-helper.service';
import { FlexFormArray } from '../../../etc/flex-form-array';
import { Constants } from '../../../../../../shared/src/constants/constants';

@Component({
  selector: 'food-web-operation-hours',
  templateUrl: './operation-hours.component.html',
  styleUrls: ['./operation-hours.component.scss']
})
export class OperationHoursComponent implements OnInit {

  readonly weekdays: string[] = Constants.WEEKDAYS;

  @Input() editing = false;
  @Input() formArray: FlexFormArray;
  @Input() formArrayName: string;

  constructor(
    public opHrsValidationService: OperationHoursValidationService,
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
        { validators: this.opHrsValidationService.operationHoursOrder }
      );
    }
    if (this._formGroupDirective.form && this.formArrayName) {
      this._formGroupDirective.form.setControl(this.formArrayName, this.formArray);
    }
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
