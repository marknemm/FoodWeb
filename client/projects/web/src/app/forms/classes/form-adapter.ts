import { Injectable, Injector } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup } from '@angular/forms';
import { Controls } from '~web/forms/interfaces/form-type-util';
import { FormValidationService } from '~web/forms/services/form-validation/form-validation.service';
import { FormValuePreprocessorService } from '~web/forms/services/form-value-preprocessor/form-value-preprocessor.service';

/**
 * Adapter for data from a (backend) `model` to a `view-model`/`FormGroup` and vice-versa.
 * @param MODEL_T The type of the (backend) `model`.
 * @param VIEW_MODEL_T The type of the adaptable `view-model` (raw data type of `FormGroup`). Defaults to `MODEL_T`.
 * @param FORM_T The type of the adaptable `FormGroup`. Defaults to `FormGroup<Controls<VIEW_MODEL_T>>`.
 */
@Injectable()
export abstract class FormAdapter<
  MODEL_T,
  VIEW_MODEL_T = Required<MODEL_T>,
  FORM_T extends AbstractControl = FormGroup<Controls<VIEW_MODEL_T>>
> {

  protected readonly _formBuilder: FormBuilder;
  protected readonly _formValidationService: FormValidationService;
  protected readonly _formValuePreprocessorService: FormValuePreprocessorService;

  constructor(
    injector: Injector
  ) {
    this._formBuilder = injector.get(FormBuilder);
    this._formValidationService = injector.get(FormValidationService);
    this._formValuePreprocessorService = injector.get(FormValuePreprocessorService);
  }

  abstract toForm(config?: FormConfig<MODEL_T>): FORM_T;

  abstract toModel(viewModel?: FORM_T | Partial<VIEW_MODEL_T>): MODEL_T;

  abstract toViewModel(model?: Partial<MODEL_T>): VIEW_MODEL_T;

  /**
   * Gets view model data from a given `viewModel`.
   * @param viewModel The given object from which to derive view model data. Can be a `FormGroup` or view model data.
   * @returns The view model data. If given `null`/`undefined`, then a view model object with default initialized members.
   */
  protected _getViewModelData(viewModel: FORM_T | Partial<VIEW_MODEL_T> | null): VIEW_MODEL_T {
    return (viewModel instanceof AbstractControl)
      ? viewModel.getRawValue()
      : (viewModel ?? this.toViewModel()); // Always return a non-null instance of view model.
  }

  protected _initForm(form: FORM_T, config: FormConfig<MODEL_T>): FORM_T;
  protected _initForm(config: FormConfig<MODEL_T>): FORM_T;

  protected _initForm(formOrConfig: FORM_T | FormConfig<MODEL_T>, config?: FormConfig<MODEL_T>): FORM_T {
    const form: FORM_T = (formOrConfig instanceof AbstractControl)
      ? formOrConfig
      : this._formBuilder.group(this.toViewModel(formOrConfig?.initValue), formOrConfig) as any;

    if (config?.initValue) {
      form.patchValue(this.toViewModel(config.initValue), { emitEvent: false });
    }

    this._formValuePreprocessorService.autoPreprocess(form);
    return form;
  }

}

export interface FormConfig<MODEL_T> extends AbstractControlOptions {
  initValue?: Partial<MODEL_T>
}
