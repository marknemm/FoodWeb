import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PerpetualSession } from '~shared';
import { AccountEntity } from './account.entity';

@Entity('PerpetualSession')
export class PerpetualSessionEntity implements PerpetualSession {

  constructor(account?: AccountEntity) {
    this.account = account;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  sessionToken: string;

  @OneToOne((type) => AccountEntity, { nullable: false, eager: true })
  @JoinColumn()
  account?: AccountEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createTimestamp?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updateTimestamp?: Date;
}
