import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { AccountEntity } from './account.entity';
import { OperationHours } from "../../../shared/src/interfaces/account";

@Entity('OperationHours')
export class OperationHoursEntity implements OperationHours {

  @PrimaryGeneratedColumn()
  operationHoursId: number;

  @Column()
  weekday: number;

  @Column()
  startHour: number;

  @Column()
  startMinute: number;

  @Column()
  endHour: number;

  @Column()
  endMinute: number;

  @ManyToOne(type => AccountEntity, account => account.operationHours)
  account: AccountEntity;

  startTime: string;

  endTime: string;
}
