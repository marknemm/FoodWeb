import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { AccountEntity } from './account.entity';
import { OperationHours } from '../../../shared/src/interfaces/account/account';
import { Constants } from '../../../shared/src/constants/constants';
import { Weekday } from '../../../shared/src/interfaces/account/operation-hours';

const _constants = new Constants();

@Entity('OperationHours')
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
