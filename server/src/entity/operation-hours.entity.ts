import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { AccountEntity } from './account.entity';
import { OperationHours } from '../shared';
import { Constants } from '../shared';
import { Weekday } from '../shared';

const _constants = new Constants();

@Entity(
  'OperationHours',
  {
    // Default order by.
    orderBy: {
      weekday: 'ASC',
      startTime: 'ASC'
    }
  }
)
@Index(['weekday', 'startTime', 'endTime'])
export class OperationHoursEntity implements OperationHours {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.WEEKDAYS })
  weekday: Weekday;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @ManyToOne((type) => AccountEntity, (account) => account.operationHours)
  account?: AccountEntity;
}
