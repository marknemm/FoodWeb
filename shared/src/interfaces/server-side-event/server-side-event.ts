export enum ServerSideEventType {
  NotificationsAvailable = 'Notifications Available'
}

export interface NotificationsAvailableEvent {
  unseenNotificationsCount: number;
}
