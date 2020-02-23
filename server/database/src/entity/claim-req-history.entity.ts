import { ManyToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';

/**
 * A history of all receiver accounts that have received a donation claim request message for an associated donation.
 * NOTE: Used to re-message all accounts so that they may be notified that the donation has been claimed.
 * When this occurs, the history entries for that donation is deleted.
 */
@OrmEntity('ClaimReqHistory')
export class ClaimReqHistoryEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DonationEntity)
  donation?: DonationEntity;

  @ManyToOne(() => AccountEntity, { eager: true })
  receiverAccount: AccountEntity;
}
