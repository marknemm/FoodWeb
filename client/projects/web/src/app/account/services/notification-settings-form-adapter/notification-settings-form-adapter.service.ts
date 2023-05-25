import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationSettings } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class NotificationSettingsFormAdapter extends FormAdapter<NotificationSettings> {

  toForm(config?: FormConfig<NotificationSettings>): NotificationSettingsForm {
    const form = this._formBuilder.group({
      enableEmail: false,
      enablePushNotification: false,
      notifyForEachDonation: false
    }, config);

    return this._initForm(form, config);
  }

  toModel(viewModel?: NotificationSettingsForm | NotificationSettings): NotificationSettings {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<NotificationSettings>): NotificationSettings {
    return {
      enableEmail: model?.enableEmail,
      enablePushNotification: model?.enablePushNotification,
      notifyForEachDonation: model?.notifyForEachDonation
    };
  }

}

export type NotificationSettingsForm = FormGroup<Controls<NotificationSettings>>;
