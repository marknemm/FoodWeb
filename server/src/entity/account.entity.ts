import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany,
  OneToOne,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { ContactInfoEntity } from './contact-info.entity';
import { OrganizationEntity } from './organization.entity';
import { VolunteerEntity } from './volunteer-entity';
import { OperationHoursEntity } from './operation-hours.entity';
import { Account, AccountType } from '../../../shared/src/interfaces/account/account';
import { Constants } from '../../../shared/src/constants/constants';
export { Account, AccountType };

const _constants = new Constants();

@Entity('Account')
export class AccountEntity implements Account {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.ACCOUNT_TYPES.concat([AccountType.Admin]) })
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

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  verified?: boolean;
}
