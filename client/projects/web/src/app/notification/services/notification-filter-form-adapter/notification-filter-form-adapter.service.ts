import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationReadRequest } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter, FormConfig } from '~web/forms/classes/form-adapter';

@Injectable({
  providedIn: 'root'
})
export class NotificationFilterFormAdapter extends FormAdapter<NotificationReadRequest, NotificationFilterFormData> {

  toForm(config?: FormConfig<NotificationReadRequest>): NotificationFilterForm {
    config ??= {};
    config.initValue ??= { limit: 10, page: 1 };
    return this._initForm(config);
  }

  toModel(viewModel?: NotificationFilterForm | Partial<NotificationFilterFormData>): NotificationReadRequest {
    return this._getViewModelData(viewModel);
  }

  toViewModel(model?: Partial<NotificationReadRequest>): NotificationFilterFormData {
    return {
      id: model?.id,
      flagged: model?.flagged,
      limit: model?.limit,
      notificationType: model?.notificationType,
      page: model?.page,
      read: model?.read,
      resetUnseenNotifications: model?.resetUnseenNotifications,
      sortBy: model?.sortBy,
      sortOrder: model?.sortOrder,
      unseen: model?.unseen
    }
  }

}

export type NotificationFilterForm = FormGroup<Controls<NotificationFilterFormData>>;
export type NotificationFilterFormData = Omit<Required<NotificationReadRequest>, 'latestTimestamp' | 'maxId'>;
