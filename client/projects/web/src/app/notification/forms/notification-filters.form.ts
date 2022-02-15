import { NotificationReadRequest } from '~shared';
import { PageListFiltersForm } from '~web/shared/forms/list-filters.form';

export class NotificationFiltersForm extends PageListFiltersForm<NotificationReadRequest> {

  constructor(filters?: Partial<NotificationReadRequest>) {
    super({
      id: undefined,
      flagged: undefined,
      limit: 10,
      notificationType: undefined,
      page: 1,
      read: undefined,
      resetUnseenNotifications: undefined,
      unseen: undefined
    });
    if (filters) {
      this.patchValue(filters);
    }
  }
}
