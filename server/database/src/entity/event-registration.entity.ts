import { Column, ManyToOne } from 'typeorm';
import { EventRegistration } from '../../../../shared/src/web';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../orm';
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
