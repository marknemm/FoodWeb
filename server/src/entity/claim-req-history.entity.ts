import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';

/**
 * A history of all receiver accounts that have received a donation claim request message for an associated donation.
 * NOTE: Used to re-message all accounts so that they may be notified that the donation has been claimed.
 * When this occurs, the history entries for that donation is deleted.
 */
@Entity('ClaimReqHistory')
export class ClaimReqHistoryEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DonationEntity)
  donation?: DonationEntity;

  @ManyToOne(() => AccountEntity, { eager: true })
  receiverAccount: AccountEntity;
}
