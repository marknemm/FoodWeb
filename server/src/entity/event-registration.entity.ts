import { Column, ManyToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../helpers/database/orm';
import { EventRegistration } from '../shared';
import { AccountEntity } from './account.entity';
import { FeaturedEventEntity } from './featured-event.entity';

@OrmEntity('EventRegistration')
export class EventRegistrationEntity implements EventRegistration {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => AccountEntity)
  account?: number;

  @Column()
  email: string;

  @ManyToOne(() => FeaturedEventEntity)
  featuredEvent: FeaturedEventEntity;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  timezone: string;
}
