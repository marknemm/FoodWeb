import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventRegistration } from '../shared';
import { AccountEntity } from './account.entity';

@Entity('EventRegistration')
export class EventRegistrationEntity implements EventRegistration {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  eventTitleDate: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @ManyToOne((type) => AccountEntity)
  account?: number;
}
