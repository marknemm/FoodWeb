import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Receiver } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
import { OrganizationEntity } from './organization.entity';
export { Receiver };

@OrmEntity('Receiver')
export class ReceiverEntity implements Receiver {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column()
  autoReceiver: boolean;

  @OneToOne((type) => OrganizationEntity, (organizationEntity) => organizationEntity.receiver)
  @JoinColumn()
  organization?: OrganizationEntity;
}
