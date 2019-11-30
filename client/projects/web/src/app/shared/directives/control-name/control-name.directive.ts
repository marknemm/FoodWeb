import { Directive, Input, OnChanges, Optional } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Directive({
  selector: '[foodWebControlName]'
})
export class ControlNameDirective implements OnChanges {

  @Input('foodWebControlName') controlName: string;

  @Input() formArray: FormArray;
  @Input() formArrayName: string;

  @Input() formControl: FormControl;
  @Input() formControlName: string;

  @Input() formGroup: FormGroup;
  @Input() formGroupName: string;

  private _abstractControl: AbstractControl;

  constructor(
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  get abstractControl(): AbstractControl {
    return this._abstractControl;
  }

  ngOnChanges() {
    if (this.controlName) {
      this._abstractControl = this._formHelperService.deriveAbstractControl(null, this.controlName, this._formGroupDirective);
    } else if (this.formArray || this.formArrayName) {
      this._abstractControl = this._formHelperService.deriveFormArray(this.formArray, this.formArrayName, this._formGroupDirective);
    } else if (this.formControl || this.formControlName) {
      this._abstractControl = this._formHelperService.deriveFormControl(this.formControl, this.formControlName, this._formGroupDirective);
    } else if (this.formGroup || this.formGroupName) {
      this._abstractControl = this._formHelperService.deriveFormGroup(this.formGroup, this.formGroupName, this._formGroupDirective);
    } 
  }

}
