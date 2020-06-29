import { Column, Index, JoinColumn, OneToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { Organization } from '~shared';
import { AccountEntity } from './account.entity';
import { DonorEntity } from './donor.entity';
import { ReceiverEntity } from './receiver.entity';

@OrmEntity('Organization')
@Index('organizationNameIdx', { synchronize: false })
export class OrganizationEntity implements Organization {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { default: '' })
  description?: string;

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
