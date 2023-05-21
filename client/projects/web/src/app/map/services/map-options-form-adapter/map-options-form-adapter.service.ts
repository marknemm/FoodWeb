import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';
import { MapOptions } from '~web/map/interfaces/map';

@Injectable({
  providedIn: 'root'
})
export class MapOptionsFormAdapter extends FormAdapter<MapOptions, MapOptionsFormData> {

  toForm(config?: FormConfig<MapOptions>): MapOptionsForm {
    return this._formBuilder.group(this.toViewModel(config?.initValue), config);
  }

  toModel(viewModel?: MapOptionsForm | Partial<MapOptionsFormData>): MapOptions {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<MapOptions>): MapOptionsFormData {
    return {
      displayRouteToDonor: model?.displayRouteToDonor,
      displayRouteToReceiver: model?.displayRouteToReceiver,
      useVolunteerCurrentPos: model?.useVolunteerCurrentPos,
    };
  }

}

export type MapOptionsForm = FormGroup<Controls<MapOptionsFormData>>;
export interface MapOptionsFormData {
  displayRouteToDonor: boolean;
  displayRouteToReceiver: boolean;
  useVolunteerCurrentPos: boolean;
}
