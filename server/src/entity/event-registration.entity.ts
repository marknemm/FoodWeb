import { Column, Index, ManyToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../helpers/database/orm';
import { EventRegistration } from '../shared';
import { AccountEntity } from './account.entity';

@OrmEntity('EventRegistration')
export class EventRegistrationEntity implements EventRegistration {

  @OrmPrimaryGeneratedColumn()
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
