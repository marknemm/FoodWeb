import { Column, Index, ManyToOne } from 'typeorm';
import { Constants, OperationHours, Weekday } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { AccountEntity } from './account.entity';

const _constants = new Constants();

@OrmEntity(
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

  @OrmPrimaryGeneratedColumn()
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
