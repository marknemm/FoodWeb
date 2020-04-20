import { ManyToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../orm';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';

/**
 * A history of all volunteer accounts that have received a delivery request message for an associated donation.
 * NOTE: Used to re-message all accounts so that they may be notified that the delivery has been scheduled.
 * When this occurs, the history entries for that donation is deleted.
 */
@OrmEntity('DeliveryReqHistory')
export class DeliveryReqHistoryEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DonationEntity)
  donation?: DonationEntity;

  @ManyToOne(() => AccountEntity, { eager: true })
  volunteerAccount: AccountEntity;
}
