import { Column, CreateDateColumn, Index, JoinColumn, ManyToMany, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { Account, AccountType, Constants, OperationHoursHelper } from '~shared';
import { OrmAfterLoad, OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { MobileDeviceEntity } from './mobile-device.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { OperationHoursEntity } from './operation-hours.entity';
import { OrganizationEntity } from './organization.entity';
import { VolunteerEntity } from './volunteer-entity';
export { Account, AccountType };

const _constants = new Constants();
const _opHoursHelper = new OperationHoursHelper();

@OrmEntity('Account')
export class AccountEntity implements Account {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.ACCOUNT_TYPES })
  accountType: AccountType;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  profileImg: string;

  @Column({ default: -1 })
  lastSeenNotificationId: number;

  @OneToOne((type) => ContactInfoEntity, { cascade: true, eager: true })
  @JoinColumn()
  contactInfo: ContactInfoEntity;

  @OneToOne((type) => OrganizationEntity, (organization) => organization.account, { nullable: true, cascade: true, eager: true })
  organization?: OrganizationEntity;

  @OneToOne((type) => VolunteerEntity, (volunteer) => volunteer.account, { nullable: true, cascade: true, eager: true })
  volunteer?: VolunteerEntity;

  @OneToMany((type) => OperationHoursEntity, (operationHours) => operationHours.account, { cascade: ['remove'], eager: true })
  operationHours: OperationHoursEntity[];

  @OneToMany((type) => MobileDeviceEntity, (mobileDevice) => mobileDevice.accountId, { cascade: ['remove'] })
  mobileDevice: MobileDeviceEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  verified?: boolean;

  @OrmAfterLoad()
  formatOperationHours(): void {
    _opHoursHelper.formatOperationHoursTimes(this.operationHours);
  }
}
