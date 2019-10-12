import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { ReceiverEntity } from './receiver.entity';
import { DonorEntity } from './donor.entity';
import { Organization } from '../../../shared/src/interfaces/account/organization';

@Entity('Organization')
export class OrganizationEntity implements Organization {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationName: string;

  @Column('text', { default: '' })
  organizationInfo?: string;

  @Column('text', { default: '' })
  deliveryInstructions?: string;

  @OneToOne((type) => AccountEntity, (accountEntity) => accountEntity.organization)
  @JoinColumn()
  account?: AccountEntity;

  @OneToOne((type) => ReceiverEntity, (receiver) => receiver.organization, { nullable: true, cascade: true, eager: true })
  receiver?: ReceiverEntity;

  @OneToOne((type) => DonorEntity, (donor) => donor.organization, { nullable: true, cascade: true, eager: true })
  donor?: DonorEntity;
}
