import { PrimaryGeneratedColumn, Entity, Column, OneToMany, OneToOne, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ContactInfoEntity } from './contact-info.entity';
import { OrganizationEntity } from './organization.entity';
import { OperationHoursEntity } from './operation-hours.entity';
import { DonationEntity } from './donation.entity';
import { Account, AccountType } from './../../../shared/src/interfaces/account/account';

@Entity('Account')
export class AccountEntity implements Account {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountType: AccountType;

  @Column()
  @Index({ unique: true })
  username: string;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.account, { cascade: true })
  contactInfo: ContactInfoEntity;

  @OneToOne((type) => OrganizationEntity, (organization) => organization.account, { nullable: true, cascade: true })
  organization?: OrganizationEntity;

  @OneToMany((type) => OperationHoursEntity, (operationHours) => operationHours.account, { cascade: true })
  operationHours: OperationHoursEntity[];

  @OneToMany((type) => DonationEntity, (donations) => donations.donorAccount, { cascade: true })
  activeDonations: DonationEntity[];

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  verified?: boolean;
}
