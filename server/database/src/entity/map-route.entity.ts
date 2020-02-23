import { Column, Index } from 'typeorm';
import { Directions, GeographyLocation, MapRoute } from '~shared';
import { OrmEntity, OrmPrimaryGeneratedColumn } from '~orm/index';
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
