import { Column, CreateDateColumn, Index, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { Account, AccountType, Constants, OperationHoursHelper } from '../../../../shared/src/web';
import { OrmAfterLoad, OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';
import { AppDataEntity } from './app-data.entity';
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
  profileImgUrl: string;

  @Column({ default: -1 })
  lastSeenNotificationId: number;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.account, { cascade: true, eager: true })
  @JoinColumn()
  contactInfo: ContactInfoEntity;

  @OneToOne((type) => OrganizationEntity, (organization) => organization.account, { nullable: true, cascade: true, eager: true })
  organization?: OrganizationEntity;

  @OneToOne((type) => VolunteerEntity, (volunteer) => volunteer.account, { nullable: true, cascade: true, eager: true })
  volunteer?: VolunteerEntity;

  @OneToMany((type) => OperationHoursEntity, (operationHours) => operationHours.account, { cascade: ['remove'], eager: true })
  operationHours: OperationHoursEntity[];

  @OneToMany((type) => AppDataEntity, (appData) => appData.accountId, { cascade: ['remove'] })
  appData: AppDataEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  verified?: boolean;

  @OrmAfterLoad()
  formatOperationHours(): void {
    _opHoursHelper.formatOperationHoursTimes(this.operationHours);
  }

  @OrmAfterLoad()
  fillVerfied(): void {

  }
}
