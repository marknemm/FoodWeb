import { Column, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { AccountEntity } from './account.entity';

@OrmEntity('PasswordReset')
export class PasswordResetEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => AccountEntity, { nullable: false })
  @JoinColumn()
  account?: AccountEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp: Date;

  @Column()
  resetToken: string;
}
