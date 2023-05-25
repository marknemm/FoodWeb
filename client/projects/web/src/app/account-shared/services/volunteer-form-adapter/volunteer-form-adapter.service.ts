import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, takeUntil } from 'rxjs';
import { Volunteer } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class VolunteerFormAdapter extends FormAdapter<Volunteer, VolunteerFormData> {

  toForm(config: VolunteerFormConfig): VolunteerForm {
    const form: VolunteerForm = this._initForm(config);

    this._formValidationService.addValidators(form, Validators.required,
      ['firstName', 'fullName', 'lastName', 'signedAgreement']);
    form.controls.fullName.addValidators(Validators.pattern(/^(\s*[^\s]+\s+[^\s]+\s*)+$/));
    form.controls.fullName.updateValueAndValidity();

    this._maintainNameFieldSync(form, config.destroy$);

    return form;
  }

  toModel(viewModel?: VolunteerForm | Partial<VolunteerFormData>): VolunteerFormData {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<Volunteer>): VolunteerFormData {
    return {
      id: model?.id,
      firstName: model?.firstName,
      fullName: (model?.firstName && model?.lastName)
        ? `${model?.firstName ?? ''} ${model?.lastName ?? ''}`.trim()
        : undefined,
      lastName: model?.lastName,
      signedAgreement: model?.signedAgreement
    };
  }

  private _maintainNameFieldSync(form: VolunteerForm, destroy$: Observable<void>): void {
    // Initialize name fields in a synced state.
    (form.controls.fullName.valid)
      ? this._deriveFirstLastName(form)
      : this._deriveFullName(form);
    form.controls.firstName.valueChanges
      .pipe(takeUntil(destroy$))
      .subscribe(() => this._deriveFullName(form));
    form.controls.lastName.valueChanges
      .pipe(takeUntil(destroy$))
      .subscribe(() => this._deriveFullName(form));
    form.controls.fullName.valueChanges
      .pipe(takeUntil(destroy$))
      .subscribe(() => this._deriveFirstLastName(form));
  }

  private _deriveFullName(form: VolunteerForm): void {
    const firstName: string = form.controls.firstName.value;
    const lastName: string = form.controls.lastName.value;
    const fullName = (firstName && lastName) // All or nothing.
      ? `${firstName} ${lastName}`
      : '';

    form.controls.fullName.setValue(fullName, { emitEvent: false });
  }

  private _deriveFirstLastName(form: VolunteerForm): void {
    const fullName: string = form.controls.fullName.value;
    if (fullName) {
      const firstLastNameSplits: string[] = fullName.trim().split(/\s+/g);
      const lastNameStartIdx: number = Math.min(2, Math.floor(firstLastNameSplits.length / 2));
      form.controls.firstName.setValue(firstLastNameSplits.slice(0, lastNameStartIdx).join(' '), { emitEvent: false });
      form.controls.lastName.setValue(firstLastNameSplits.slice(lastNameStartIdx).join(' '), { emitEvent: false });
    } else {
      // If full name is changed and invalid, then clear out first/last name.
      form.controls.firstName.setValue('', { emitEvent: false });
      form.controls.lastName.setValue('', { emitEvent: false });
    }
  }

}

export type VolunteerForm = FormGroup<Controls<VolunteerFormData>>;

export interface VolunteerFormData extends Required<Volunteer> {
  fullName: string;
}

export interface VolunteerFormConfig extends FormConfig<Volunteer> {
  /**
   * Observable that should fire when FormGroup (containing component) is to be destroyed to cleanup any internal rxjs subscriptions.
   */
  destroy$: Observable<void>;
}
