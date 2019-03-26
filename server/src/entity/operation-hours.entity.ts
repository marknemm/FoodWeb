import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { OperationHours } from '../../../shared/src/interfaces/account/account';

@Entity('OperationHours')
export class OperationHoursEntity implements OperationHours {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekday: string;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @ManyToOne((type) => AccountEntity, (account) => account.operationHours)
  account?: AccountEntity;
}
