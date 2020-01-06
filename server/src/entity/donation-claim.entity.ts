import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DonationClaim } from '../shared';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';
import { MapRouteEntity } from './map-route.entity';
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

  @Column()
  dropOffWindowStart: Date;

  @Column()
  dropOffWindowEnd: Date;

  @ManyToOne((type) => MapRouteEntity, { eager: true, cascade: ['insert', 'update'] })
  routeToReceiver: MapRouteEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
