import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { AccountEntity } from './account.entity';
import { ContactInfo, GeographyLocation } from './../../../shared/src/interfaces/account/contact-info';

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

  @OneToOne((type) => AccountEntity, (account) => account.contactInfo)
  @JoinColumn()
  account?: AccountEntity;
}
