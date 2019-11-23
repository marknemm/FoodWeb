import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Constants, Donation, DonationStatus } from '../shared';
import { AccountEntity } from './account.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { DeliveryEntity } from './delivery-entity';
export { Donation, DonationStatus };

const _constants = new Constants();

@Entity('Donation')
export class DonationEntity implements Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity, { eager: true })
  donorAccount: AccountEntity;

  @OneToOne((type) => ContactInfoEntity, (contactInfo) => contactInfo.donation, { eager: true, cascade: true })
  @JoinColumn()
  donorContactOverride: ContactInfoEntity;

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

  @Column({ type: 'numeric', nullable: true })
  estimatedValue?: number;

  @Column({ type: 'integer' })
  estimatedNumFeed: number;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: Date;

  @Column({ type: 'enum', enum: _constants.DONATION_STATUSES, default: _constants.DONATION_STATUSES[0] })
  donationStatus: DonationStatus;

  @OneToOne((type) => DeliveryEntity, (delivery) => delivery.donation, { nullable: true, cascade: true, eager: true })
  delivery: DeliveryEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
