import { AfterInsert, AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DonationHub } from '~shared';
import { AccountEntity } from './account.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { DonationHubPledgeEntity } from './donation-hub-pledge.entity';
export { DonationHub };

@Entity('DonationHub')
export class DonationHubEntity implements DonationHub {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  dropOffWindowStart: Date;

  @Column({ type: 'timestamp with time zone' })
  dropOffWindowEnd: Date;

  @Column()
  dropOffInstructions: string;

  @OneToOne((type) => ContactInfoEntity, { cascade: true, eager: true, nullable: true })
  @JoinColumn()
  contactOverride?: ContactInfoEntity;

  @OneToMany((type) => DonationHubPledgeEntity, (donationHubPledge) => donationHubPledge.donationHub)
  pledges?: DonationHubPledgeEntity[];

  @ManyToOne((type) => AccountEntity)
  receiverAccount?: AccountEntity;

  @ManyToOne((type) => AccountEntity, { eager: true })
  volunteerAccount?: AccountEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;

  /**
   * Ensures that `contactOverride` is always present in data loaded after insert & read operations.
   * If there is no override data, then sets it to the `contactInfo` on the `volunteerAccount`.
   */
  @AfterLoad()
  @AfterInsert()
  fillMissingContactOverride(): void {
    if (!this.contactOverride && this.volunteerAccount?.contactInfo) {
      this.contactOverride = this.volunteerAccount.contactInfo;
    }
  }
}
