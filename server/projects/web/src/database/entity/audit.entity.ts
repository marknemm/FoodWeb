import { Column, CreateDateColumn, JoinTable, ManyToMany } from 'typeorm';
import { Audit, AuditData, AuditEventType, Constants } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm';
import { AccountEntity } from './account.entity';

const _constants = new Constants();

@OrmEntity('Audit')
export class AuditEntity<T = any> implements Audit {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.AUDIT_EVENT_TYPES })
  eventType: AuditEventType;

  @Column({ type: 'json' })
  data: AuditData<T>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'float', nullable: true })
  recaptchaScore?: number;

  @ManyToMany((type) => AccountEntity, { eager: true })
  @JoinTable({ name: 'AuditAccountMap' })
  accounts: AccountEntity[];
}
