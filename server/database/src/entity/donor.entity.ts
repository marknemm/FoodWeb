import { JoinColumn, OneToOne } from 'typeorm';
import { Donor } from '../../../../shared/src/web';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../../../projects/web/src/helpers/orm';
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
