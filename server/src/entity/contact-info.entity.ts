import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { AccountEntity } from './account.entity';
import { ContactInfo } from './../../../shared/src/interfaces/contact-info';

@Entity('ContactInfo')
export class ContactInfoEntity implements ContactInfo {

  @PrimaryGeneratedColumn()
  contactInfoId: number;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  stateProvince: string;

  @Column()
  postalCode: string;

  @OneToOne(type => AccountEntity, account => account.contactInfo)
  @JoinColumn()
  account: AccountEntity;
}
