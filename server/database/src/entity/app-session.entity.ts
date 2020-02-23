import { Column, CreateDateColumn, Index, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { AccountEntity } from './account.entity';

@OrmEntity('AppSession')
export class AppSessionEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  appSessionToken: string;

  @OneToOne((type) => AccountEntity, { nullable: false, eager: true })
  @JoinColumn()
  account: AccountEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp?: Date;
}
