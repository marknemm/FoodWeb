import { Injectable, Injector } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Controls, UpdateValueOptions } from '~web/forms/interfaces/form-type-util';
import { FormValidationService } from '~web/forms/services/form-validation/form-validation.service';
import { FormValuePreprocessorService } from '~web/forms/services/form-value-preprocessor/form-value-preprocessor.service';
import { ObjectService } from '~web/shared/services/object/object.service';

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
  protected readonly _objectService: ObjectService;

  constructor(
    injector: Injector
  ) {
    this._formBuilder = injector.get(FormBuilder);
    this._formValidationService = injector.get(FormValidationService);
    this._formValuePreprocessorService = injector.get(FormValuePreprocessorService);
    this._objectService = injector.get(ObjectService);
  }

  abstract toForm(config?: FormConfig<MODEL_T>): FORM_T;

  abstract toModel(viewModel?: FORM_T | Partial<VIEW_MODEL_T>): MODEL_T;

  abstract toViewModel(model?: Partial<MODEL_T>): VIEW_MODEL_T;

  toPartialViewModel(model?: Partial<MODEL_T>): Partial<VIEW_MODEL_T> {
    const viewModel: VIEW_MODEL_T = this.toViewModel(model);
    return this._objectService.omitByRecursive(viewModel, (value: any) =>
         _.isUndefined(value)
      || (_.isObject(value) && _.isEmpty(value)));
  }

  /**
   * Patches the value of a given `form` from a given `model`.
   * @param form The `FormGroup` to patch.
   * @param model The model containing the patch value.
   * @param options The options used during the `FormGroup` patch operation.
   */
  patchFromModel(form: FORM_T, model: Partial<MODEL_T>, options?: UpdateOptions): void {
    if (options?.fields) {
      model = this._objectService.mergeFields(model, {}, options.fields);
    }
    let viewModel: Partial<VIEW_MODEL_T> = this.toPartialViewModel(model);
    viewModel = this._formValuePreprocessorService.prepareForUpdate(form, viewModel);
    form.patchValue(viewModel, options);
  }

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

}

export interface FormConfig<MODEL_T> extends AbstractControlOptions {
  initValue?: Partial<MODEL_T>
}

/**
 * Options for performing a `FormGroup` patch operation.
 */
export interface UpdateOptions extends UpdateValueOptions {
  /**
   * Subset of fields to include in the patch. If not set, then all fields are included.
   * Supports dot notation for nested fields.
   */
  fields?: string[];
  /**
   * Set to `true` if `''` values should be omitted form the patch operation. Defaults to `false`.
   */
  omitEmptyStr?: boolean;
  /**
   * Set to `true` if `null` values should be omitted from the patch operation. Defaults to `false`.
   */
  omitNull?: boolean;
}

export interface ViewModelOptions {
  fullViewModel?: boolean;
}
