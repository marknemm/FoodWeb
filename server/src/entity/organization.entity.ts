import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
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
}
