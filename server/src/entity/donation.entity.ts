import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { Constants } from '../../../shared/src/constants/constants';
import { AccountEntity } from './account.entity';

const _constants = new Constants();

@Entity('Donation')
export class DonationEntity implements Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, (account) => account.activeDonations, { eager: true })
  donorAccount: AccountEntity;

  @ManyToOne((type) => AccountEntity, (account) => account.activeDonations, { nullable: true, eager: true })
  receiverAccount: AccountEntity;

  @Column()
  @Index()
  donorLastName: string;

  @Column()
  donorFirstName: string;

  @Column()
  donationType: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', scale: 2 })
  estimatedValue: number;

  @Column({ type: 'integer' })
  estimatedNumFeed: number;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: string;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: string;

  @Column({ type: 'enum', enum: _constants.DONATION_STATUSES, default: _constants.DONATION_STATUSES[1] })
  donationStatus: DonationStatus;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
