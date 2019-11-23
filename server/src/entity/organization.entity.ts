import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../shared';
import { AccountEntity } from './account.entity';
import { DonorEntity } from './donor.entity';
import { ReceiverEntity } from './receiver.entity';

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
