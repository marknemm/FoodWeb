import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { AppData } from '../../../shared/src/interfaces/app-data/app-data';
export { AppData };

@Entity('AppData')
export class AppDataEntity implements AppData {

  @PrimaryColumn()
  deviceUuid: string;

  @PrimaryColumn()
  accountId?: number;

  @Column({ nullable: true })
  devicePlatform?: string;

  @Column({ nullable: true })
  deviceModel?: string;

  @Column({ nullable: true })
  deviceVersion?: string;

  @Column({ nullable: true })
  deviceManufacturer?: string;

  @Column({ nullable: true })
  deviceSerial?: string;

  @Column({ default: false })
  deviceIsVirtual?: boolean;

  @Column({ nullable: true })
  pushRegistrationId?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp?: Date;
}
