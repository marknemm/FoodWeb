import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContactInfo, GeographyLocation } from '../shared';
import { AccountEntity } from './account.entity';
import { DonationEntity } from './donation.entity';

@Entity('ContactInfo')
export class ContactInfoEntity implements ContactInfo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string;

  @Column()
  phoneNumber: string;

  @Index()
  @Column()
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  stateProvince: string;

  @Column()
  postalCode: string;

  @Column('geography')
  @Index({ spatial: true })
  location: GeographyLocation;

  @Column()
  timezone: string;

  @Column({ default: true })
  enableEmail: boolean;

  @Column({ default: true })
  enablePushNotification: boolean;

  @Column({ default: true }) // TODO: Change to false in the future when we have a lot more activity!!!
  notifyForEachDonation: boolean;

  @OneToOne((type) => AccountEntity, (account) => account.contactInfo)
  account?: AccountEntity;

  @OneToOne((type) => DonationEntity, (donation) => donation.donorContactOverride)
  donation?: DonationEntity;
}
