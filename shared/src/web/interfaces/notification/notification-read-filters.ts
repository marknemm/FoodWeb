import { NotificationType } from './notification';

export interface NotificationReadFilters {
  id?: number;
  notificationType?: NotificationType | string;
  unseen?: boolean;
  read?: boolean;
  flagged?: boolean;
}
