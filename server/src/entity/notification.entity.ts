import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { AuditEntity } from './audit.entity';
import { Notification, NotificationType } from '../../../shared/src/interfaces/notification/notification';
import { Constants } from '../../../shared/src/constants/constants';

const _constants = new Constants();

@Entity('Notification')
export class NotificationEntity implements Notification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.NOTIFICATION_TYPES })
  notificationType: NotificationType;

  @Column()
  notificationDetailId: number;

  @Column({ nullable: true })
  notificationIconUrl?: string;

  @Column()
  notificationTitle: string;

  @Column({ nullable: true })
  notificationSubtitle?: string;

  @Column({ nullable: true })
  notificationBody: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  flagged: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @ManyToOne((type) => AccountEntity)
  account?: AccountEntity;

  @ManyToOne((type) => AuditEntity)
  audit?: AuditEntity;
}
