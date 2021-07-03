import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { MobileDevice } from '~shared';
export { MobileDevice };

@Entity('MobileDevice')
export class MobileDeviceEntity implements MobileDevice {

  @PrimaryColumn()
  uuid: string;

  @PrimaryColumn()
  accountId?: number;

  @Column({ default: false })
  isVirtual?: boolean;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  operatingSystem?: string;

  @Column({ nullable: true })
  osVersion?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  pushRegistrationId?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp?: Date;
}
