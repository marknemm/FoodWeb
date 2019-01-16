import { FormArray, AbstractControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { FormHelperService } from "../services/form-helper/form-helper.service";

export class FlexFormArray extends FormArray {

  private readonly _formHelper = new FormHelperService(new FormBuilder());

  constructor(
    controls: AbstractControl[],
    public memberTmpl?: AbstractControl,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  patchValue(value: any[], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._restructureFormArray(value.length);
    super.patchValue(value, options);
  }

  push(value: any): void;
  push(control: AbstractControl): void;
  push(value: AbstractControl | any): void {
    if (value instanceof FormControl || value instanceof FormArray || value instanceof FormGroup) {
      super.push(value);
    } else {
      this._addNeededMembers(this.length + 1);
      this.at(this.length - 1).patchValue(value);
    }
  }

  reset(value: any = [], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    if (value instanceof Array) {
      this._restructureFormArray(value.length);
    }
    super.reset(value, options);
  }

  setValue(value: any[], options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._restructureFormArray(value.length);
    super.setValue(value, options);
  }

  private _restructureFormArray(length: number): void {
    this._removeExcessMembers(length);
    this._addNeededMembers(length);
  }

  private _removeExcessMembers(length: number): void {
    while (this.length > length) {
      this.removeAt(this.length - 1);
    }
  }

  private _addNeededMembers(length: number): void {
    this.memberTmpl = (this.memberTmpl ? this.memberTmpl : new FormControl());
    while (this.length < length) {
      const memberTmplCopy: AbstractControl = this._formHelper.copyAbstractControl(this.memberTmpl);
      if (memberTmplCopy instanceof FlexFormArray) {
        memberTmplCopy.memberTmpl = this.memberTmpl;
      }
      super.push(memberTmplCopy);
    }
  }
}
