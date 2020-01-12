import { Column, CreateDateColumn, Index, JoinColumn, ManyToOne, OneToOne, UpdateDateColumn } from 'typeorm';
import { OrmAfterLoad, OrmEntity, OrmPrimaryGeneratedColumn } from '../helpers/database/orm';
import { Donation, DonationStatus, DONATION_STATUSES } from '../shared';
import { AccountEntity } from './account.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { DonationClaimEntity } from './donation-claim.entity';
import _ = require('lodash');
export { Donation, DonationStatus };

@OrmEntity('Donation')
export class DonationEntity implements Donation {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, { eager: true })
  donorAccount: AccountEntity;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.donation, { nullable: true, eager: true, cascade: true })
  @JoinColumn()
  donorContactOverride?: ContactInfoEntity;

  @OneToOne((type) => DonationClaimEntity, (donationClaim) => donationClaim.donation, { nullable: true, eager: true, cascade: true })
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

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  @OrmAfterLoad()
  private _fillDonorContactOverride(): void {
    if (!this.donorContactOverride && this.donorAccount?.contactInfo) {
      this.donorContactOverride = _.cloneDeep(this.donorAccount.contactInfo);
    }
  }
}
