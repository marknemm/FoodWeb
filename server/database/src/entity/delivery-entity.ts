import { Column, CreateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Delivery } from '../../../../shared/src/web';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';
import { AccountEntity } from './account.entity';
import { DonationClaimEntity } from './donation-claim.entity';
import { MapRouteEntity } from './map-route.entity';

@OrmEntity('Delivery')
export class DeliveryEntity implements Delivery {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => DonationClaimEntity, (claim) => claim.delivery, { onDelete: 'CASCADE' })
  @JoinColumn()
  claim?: DonationClaimEntity;

  @ManyToOne((type) => AccountEntity, { eager: true })
  volunteerAccount: AccountEntity;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  pickupWindowEnd: Date;

  @Column({ type: 'timestamp with time zone' })
  dropOffWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  dropOffWindowEnd: Date;

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
