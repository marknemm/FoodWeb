import { Column, Index } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';

@OrmEntity('FullTextSearch')
@Index(['entityId', 'entityTable'], { unique: true })
@Index('fullText', { synchronize: false })
export class FullTextSearchEntity {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  entityId: number;

  @Column()
  entityTable: string;

  @Column({ type: 'tsvector', default: '', select: false })
  fullText: string;
}
