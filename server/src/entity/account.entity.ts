import { PrimaryGeneratedColumn, Entity, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { ContactInfoEntity } from './contact-info.entity';
import { OrganizationEntity } from './organization.entity';
import { OperationHoursEntity } from './operation-hours.entity';
import { Account, AccountType } from './../../../shared/src/interfaces/account';

@Entity('Account')
export class AccountEntity implements Account {

  @PrimaryGeneratedColumn()
  accountId: number;

  @Column()
  accountType: AccountType;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @OneToOne(type => ContactInfoEntity, contactInfo => contactInfo.account)
  contactInfo: ContactInfoEntity;

  @OneToOne(type => OrganizationEntity, organization => organization.account, { nullable: true })
  organization?: OrganizationEntity;

  @OneToMany(type => OperationHoursEntity, operationHours => operationHours.account)
  operationHours: OperationHoursEntity[];

  @Column('text', { default: '' })
  additionalInfo?: string;

  verified?: boolean;
}
