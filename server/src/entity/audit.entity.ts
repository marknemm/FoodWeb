import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { AccountEntity } from './account.entity';
import { Constants } from '../../../shared/src/constants/constants';
import { Audit, AuditEventType, AuditData } from '../../../shared/src/interfaces/audit/audit';

const _constants = new Constants();

@Entity('Audit')
export class AuditEntity<T = any> implements Audit {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: _constants.AUDIT_EVENT_TYPES })
  eventType: AuditEventType;

  @Column({ type: 'json' })
  data: AuditData<T>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: string;

  @ManyToMany((type) => AccountEntity, { eager: true })
  @JoinTable({ name: 'AuditAccountMap' })
  accounts: AccountEntity[];
}
