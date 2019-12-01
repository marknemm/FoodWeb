import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Donation, DonationStatus, DONATION_STATUSES } from '../shared';
import { AccountEntity } from './account.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { DeliveryEntity } from './delivery-entity';
import { DonationClaimEntity } from './donation-claim.entity';
export { Donation, DonationStatus };

@Entity('Donation')
export class DonationEntity implements Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, { eager: true })
  donorAccount: AccountEntity;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.donation, { eager: true, cascade: true })
  @JoinColumn()
  donorContactOverride: ContactInfoEntity;

  @OneToOne((type) => DonationClaimEntity, (donationClaim) => donationClaim.donation, { nullable: true, eager: true })
  claim?: DonationClaimEntity;

  @Column()
  @Index()
  donorLastName: string;

  @Column()
  donorFirstName: string;

  @Column()
  donationType: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', nullable: true })
  estimatedValue?: number;

  @Column({ type: 'integer' })
  estimatedNumFeed: number;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: Date;

  @Column({ type: 'enum', enum: DONATION_STATUSES, default: DONATION_STATUSES[0] })
  donationStatus: DonationStatus;

  @OneToOne((type) => DeliveryEntity, (delivery) => delivery.donation, { nullable: true, cascade: true, eager: true })
  delivery: DeliveryEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
