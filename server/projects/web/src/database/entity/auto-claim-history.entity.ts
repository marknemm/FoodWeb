import { Column, Index, JoinColumn, OneToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { DonationClaimEntity } from './donation-claim.entity';

@OrmEntity('AutoClaimHistory')
export class AutoClaimHistoryEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  @Index()
  timestamp: Date;

  @OneToOne((type) => DonationClaimEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  claim: DonationClaimEntity;
}
