import { Column, Index, OneToMany } from 'typeorm';
import { FeaturedEvent } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { EventRegistrationEntity } from './event-registration.entity';
export { FeaturedEvent, EventRegistrationEntity };

@OrmEntity('FeaturedEvent')
export class FeaturedEventEntity implements FeaturedEvent {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column({ type: 'timestamp with time zone' })
  @Index()
  date: Date;

  @Column()
  description: string;

  @Column({ nullable: true })
  durationMins?: number;

  @Column()
  postalCode: string;

  @Column({ type: 'timestamp with time zone' })
  @Index()
  showUntil: Date;

  @Column({ default: '' })
  signupCompleteMsg: string;

  @Column({ default: '' })
  signupTitle: string;

  @Column()
  stateProvince: string;

  @Column()
  streetAddress: string;

  @Column()
  title: string;

  @OneToMany((type) => EventRegistrationEntity, (registration) => registration.featuredEvent)
  registrations?: EventRegistrationEntity[];
}
