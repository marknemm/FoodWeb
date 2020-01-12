import { Column, Index } from 'typeorm';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '../helpers/database/orm';
import { Directions, GeographyLocation, MapRoute } from '../shared';
export { Directions, MapRoute };

@OrmEntity('MapRoute')
export class MapRouteEntity implements MapRoute {

  @OrmPrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  distanceMi: number;

  @Column({ type: 'integer' })
  durationMin: number;

  @Column({ type: 'json' })
  directions: Directions;

  @Column('geography')
  @Index({ spatial: true })
  endLocation: GeographyLocation;

  @Column('geography')
  @Index({ spatial: true })
  startLocation: GeographyLocation;
}
