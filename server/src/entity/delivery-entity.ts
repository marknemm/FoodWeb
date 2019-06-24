import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { DonationEntity } from './donation.entity';
import { AccountEntity } from './account.entity';
import { Delivery } from '../../../shared/src/interfaces/delivery/delivery';

@Entity('Delivery')
export class DeliveryEntity implements Delivery {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => DonationEntity, (donation) => donation.delivery)
  @JoinColumn()
  donation?: DonationEntity;

  @ManyToOne((type) => AccountEntity, { eager: true })
  volunteerAccount: AccountEntity;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: string;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  pickupTime?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dropOffTime?: string;
}