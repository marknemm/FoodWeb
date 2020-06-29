import { Column, CreateDateColumn } from 'typeorm';
import { AppData } from '~shared';
import { OrmEntity, OrmPrimaryColumn } from '~orm';
export { AppData };

@OrmEntity('AppData')
export class AppDataEntity implements AppData {

  @OrmPrimaryColumn()
  deviceUuid: string;

  @OrmPrimaryColumn()
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
