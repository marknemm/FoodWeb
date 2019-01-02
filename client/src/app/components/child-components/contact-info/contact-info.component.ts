import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import {
  FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS,
  ControlValueAccessor, Validator, ValidationErrors
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Validation } from '../../../../../../shared/src/constants/validation';
import { ContactInfo } from '../../../../../../shared/src/interfaces/contact-info';

@Component({
  selector: 'food-web-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContactInfoComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ContactInfoComponent), multi: true }
  ]
})
export class ContactInfoComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Input() editing = false;

  contactInfoForm: FormGroup;

  private $_destroy = new Subject();

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.contactInfoForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Validation.PHONE_REGEX)]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(Validation.POSTAL_CODE_REGEX)]]
    });
  }

  ngOnDestroy() {
    this.$_destroy.next();
    this.$_destroy.complete();
  }

  writeValue(value: ContactInfo): void {
    value = (value ? value : { email: '', streetAddress: '', city: '', stateProvince: '', postalCode: '', phoneNumber: '' });
    this.contactInfoForm.setValue(value, { emitEvent: false });
  }

  registerOnChange(onChangeCb: (value: ContactInfo) => void): void {
    this.contactInfoForm.valueChanges.pipe(
      takeUntil(this.$_destroy)
    ).subscribe(onChangeCb);
  }

  validate(): ValidationErrors {
    return (this.contactInfoForm.invalid ? { invalid: true } : null);
  }

  registerOnTouched(): void {}

}
