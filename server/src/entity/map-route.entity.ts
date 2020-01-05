import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Directions, MapRoute, GeographyLocation } from '../shared';
export { Directions, MapRoute };

@Entity('MapRoute')
export class MapRouteEntity implements MapRoute {

  @PrimaryGeneratedColumn()
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
