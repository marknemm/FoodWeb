import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { AccountEntity } from './account.entity';

@Entity('Donation')
export class DonationEntity implements Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, (account) => account.activeDonations)
  donorAccount: AccountEntity;

  @ManyToOne((type) => AccountEntity, (account) => account.activeDonations, { nullable: true })
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

  @Column({ default: 'Unmatched' })
  donationStatus: DonationStatus;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
