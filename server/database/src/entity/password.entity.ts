import { Column, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../orm';
import { AccountEntity } from './account.entity';

@OrmEntity('Password')
export class PasswordEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  passwordHash: string;

  @OneToOne((type) => AccountEntity)
  @JoinColumn()
  account?: AccountEntity;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp: Date;
}
