export enum ServerSentEventType {
  NotificationsAvailable = 'Notifications Available'
}

export interface NotificationsAvailableEvent {
  unseenNotificationsCount: number;
}
