import { Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { Notification, NotificationType } from '~shared';
import { AccountEntity } from './account.entity';
export { Notification, NotificationType };

@OrmEntity('Notification')
export class NotificationEntity implements Notification {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
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
