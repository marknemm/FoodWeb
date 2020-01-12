import { JoinColumn, OneToOne } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../helpers/database/orm';
import { Donor } from '../shared';
import { OrganizationEntity } from './organization.entity';
export { Donor };

@OrmEntity('Donor')
export class DonorEntity implements Donor {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => OrganizationEntity, (organizationEntity) => organizationEntity.donor)
  @JoinColumn()
  organization?: OrganizationEntity;
}
