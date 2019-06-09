import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { AuditEntity } from './audit.entity';
import { Notification, NotificationType } from '../../../shared/src/interfaces/notification/notification';

@Entity('Notification')
export class NotificationEntity implements Notification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notificationType: NotificationType;

  @Column()
  notificationDetailId: number;

  @Column()
  notificationIconUrl?: string;

  @Column()
  notificationTitle: string;

  @Column()
  notificationSubtitle: string;

  @Column()
  notificationBody: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  flagged: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: string;

  @ManyToOne((type) => AccountEntity)
  account?: AccountEntity;

  @ManyToOne((type) => AuditEntity)
  audit?: AuditEntity;
}
