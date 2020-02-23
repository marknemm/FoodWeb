import { JoinColumn, OneToOne } from 'typeorm';
import { Donor } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
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
