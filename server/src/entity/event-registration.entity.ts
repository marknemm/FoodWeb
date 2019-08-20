import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Index, UpdateDateColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { DeliveryEntity } from './delivery-entity';
import { EventRegistration } from '../../../shared/src/interfaces/event/event-registration';

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
