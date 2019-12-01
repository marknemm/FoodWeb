import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DonationClaim } from '../shared';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';
export { DonationClaim };

@Entity('DonationClaim')
export class DonationClaimEntity implements DonationClaim {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => DonationEntity, (donation) => donation.claim)
  @JoinColumn()
  donation?: DonationEntity;

  @ManyToOne((type) => AccountEntity, { nullable: true, eager: true })
  receiverAccount: AccountEntity;

  @Column({ type: 'real' })
  distanceMiToReceiver: number;

  @Column({ type: 'integer' })
  durationMinToReceiver: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
