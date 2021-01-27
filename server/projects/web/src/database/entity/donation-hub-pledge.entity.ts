import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DonationHubPledge } from '~shared';
import { AccountEntity } from './account.entity';
import { DonationHubEntity } from './donation-hub.entity';
export { DonationHubPledge };

@Entity('DonationHubPledge')
export class DonationHubPledgeEntity implements DonationHubPledge {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodType: string;

  @Column()
  foodCount: number;

  @ManyToOne((type) => AccountEntity, { eager: true })
  account?: AccountEntity;

  @ManyToOne((type) => DonationHubEntity, (donationHub) => donationHub.pledges, { eager: true, onDelete: 'CASCADE' })
  donationHub?: DonationHubEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;
}
