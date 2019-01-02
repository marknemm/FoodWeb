import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS,
  ControlValueAccessor, Validator, ValidationErrors
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Organization } from '../../../../../../shared/src/interfaces/organization';

@Component({
  selector: 'food-web-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OrganizationComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => OrganizationComponent), multi: true }
  ]
})
export class OrganizationComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;

  organizationForm: FormGroup;

  private $_destroy = new Subject();

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.organizationForm = this._formBuilder.group({
      organizationName: ['', Validators.required],
      organizationInfo: ''
    });
  }

  ngOnDestroy() {
    this.$_destroy.next();
    this.$_destroy.complete();
  }

  writeValue(value: Organization): void {
    value = (value ? value : { organizationName: '', organizationInfo: '' });
    this.organizationForm.setValue(value, { emitEvent: false });
  }

  registerOnChange(onChangeCb: (value: Organization) => void): void {
    this.organizationForm.valueChanges.pipe(
      takeUntil(this.$_destroy)
    ).subscribe(onChangeCb);
  }

  validate(): ValidationErrors {
    return (this.organizationForm.invalid ? { invalid: true } : null);
  }

  registerOnTouched(): void {}

}
