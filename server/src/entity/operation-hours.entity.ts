import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { OperationHours } from '../../../shared/src/interfaces/account/account';
import { Constants } from '../../../shared/src/constants/constants';

const _constants = new Constants();

@Entity('OperationHours')
export class OperationHoursEntity implements OperationHours {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.WEEKDAYS })
  weekday: string;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @ManyToOne((type) => AccountEntity, (account) => account.operationHours)
  account?: AccountEntity;
}
