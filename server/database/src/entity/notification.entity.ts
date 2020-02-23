import { Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Constants, Notification, NotificationType } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { AccountEntity } from './account.entity';
export { Notification, NotificationType };

const _constants = new Constants();

@OrmEntity('Notification')
export class NotificationEntity implements Notification {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.NOTIFICATION_TYPES })
  notificationType: NotificationType;

  @Column({ nullable: true })
  notificationLink?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })  
  image?: string;

  @Column({ nullable: true })  
  priority?: 'high' | 'normal';

  @Column({ nullable: true })  
  action?: string;

  @Column({ nullable: true })  
  tag?: string;

  @Column({ type: 'json', nullable: true })  
  custom?: any;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  flagged: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @ManyToOne((type) => AccountEntity)
  account?: AccountEntity;
}
