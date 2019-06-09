import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index, UpdateDateColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { DeliveryEntity } from './delivery-entity';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { Constants } from '../../../shared/src/constants/constants';

const _constants = new Constants();

@Entity('Donation')
export class DonationEntity implements Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, { eager: true })
  donorAccount: AccountEntity;

  @ManyToOne((type) => AccountEntity, { nullable: true, eager: true })
  receiverAccount?: AccountEntity;

  @Column()
  @Index()
  donorLastName: string;

  @Column()
  donorFirstName: string;

  @Column()
  donationType: string;

  @Column()
  description: string;

  @Column({ type: 'numeric' })
  estimatedValue: number;

  @Column({ type: 'integer' })
  estimatedNumFeed: number;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: string;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: string;

  @Column({ type: 'enum', enum: _constants.DONATION_STATUSES, default: _constants.DONATION_STATUSES[0] })
  donationStatus: DonationStatus;

  @OneToOne((type) => DeliveryEntity, (delivery) => delivery.donation, { nullable: true, cascade: true, eager: true })
  delivery: DeliveryEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
