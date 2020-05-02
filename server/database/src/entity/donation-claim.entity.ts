import { Column, CreateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DonationClaim } from '../../../../shared/src/web';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';
import { AccountEntity } from './account.entity';
import { DeliveryEntity } from './delivery-entity';
import { DonationEntity } from './donation.entity';
import { MapRouteEntity } from './map-route.entity';
export { DonationClaim };

@OrmEntity('DonationClaim')
export class DonationClaimEntity implements DonationClaim {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => DonationEntity, (donation) => donation.claim, { onDelete: 'CASCADE' })
  @JoinColumn()
  donation?: DonationEntity;

  @ManyToOne((type) => AccountEntity, { nullable: true, eager: true })
  receiverAccount: AccountEntity;

  @OneToOne((type) => DeliveryEntity, (delivery) => delivery.claim, { nullable: true, cascade: true, eager: true })
  delivery?: DeliveryEntity;

  @Column()
  dropOffWindowStart: Date;

  @Column()
  dropOffWindowEnd: Date;

  @ManyToOne((type) => MapRouteEntity, { eager: true, cascade: ['insert', 'update'] })
  routeToReceiver: MapRouteEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;
}
