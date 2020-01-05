import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Delivery } from '../shared';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';
import { MapRouteEntity } from './map-route.entity';

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
  pickupWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: Date;

  @ManyToOne((type) => MapRouteEntity, { eager: true, cascade: ['insert', 'update'] })
  routeToDonor: MapRouteEntity;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  pickupTime?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dropOffTime?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
