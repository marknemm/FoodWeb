import { PrimaryGeneratedColumn, Entity, Column, OneToMany, OneToOne, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ContactInfoEntity } from './contact-info.entity';
import { OrganizationEntity } from './organization.entity';
import { VolunteerEntity } from './volunteer-entity';
import { OperationHoursEntity } from './operation-hours.entity';
import { DonationEntity } from './donation.entity';
import { DeliveryEntity } from './delivery-entity';
import { Account, AccountType } from '../../../shared/src/interfaces/account/account';
import { Constants } from '../../../shared/src/constants/constants';

const _constants = new Constants();

@Entity('Account')
export class AccountEntity implements Account {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.ACCOUNT_TYPES.concat(['Admin']) })
  accountType: AccountType;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  profileImgUrl: string;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.account, { cascade: true, eager: true })
  contactInfo: ContactInfoEntity;

  @OneToOne((type) => OrganizationEntity, (organization) => organization.account, { nullable: true, cascade: true, eager: true })
  organization?: OrganizationEntity;

  @OneToOne((type) => VolunteerEntity, (volunteer) => volunteer.account, { nullable: true, cascade: true, eager: true })
  volunteer?: VolunteerEntity;

  @OneToMany((type) => OperationHoursEntity, (operationHours) => operationHours.account, { cascade: ['remove'], eager: true })
  operationHours: OperationHoursEntity[];

  @OneToMany((type) => DonationEntity, (donation) => donation.donorAccount, { cascade: true })
  donations?: DonationEntity[];

  @OneToMany((type) => DonationEntity, (donation) => donation.receiverAccount, { cascade: true })
  claims?: DonationEntity[];

  @OneToMany((type) => DeliveryEntity, (delivery) => delivery.volunteerAccount, { cascade: true })
  deliveries?: DeliveryEntity[];

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  verified?: boolean;
}
