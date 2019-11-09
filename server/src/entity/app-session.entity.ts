import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('AppSession')
export class AppSessionEntity {

  @PrimaryGeneratedColumn()
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
