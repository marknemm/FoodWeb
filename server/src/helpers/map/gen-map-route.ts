import { plainToClass } from 'class-transformer';
import { getRepository } from 'typeorm';
import { MapRouteEntity } from '../../entity/map-route.entity';
import { ContactInfo, Directions, MapRoute } from '../../shared';
import { genDirections } from './directions';

/**
 * Generates a map route for a route segment between two addresses contained within a given donation (e.g. volunteer -> donor, donor -> receiver).
 * @param orig The origin contact info (address) of the route that is to be generated.
 * @param dest The destination contact info (address) of the route that is to be generated.
 * @return A promise that resolves to the generated map route.
 */
export async function genMapRoute(orig: ContactInfo, dest: ContactInfo): Promise<MapRouteEntity> {
  const foundMapRoute: MapRoute = await _findMapRoute(orig, dest);
  return plainToClass(
    MapRouteEntity,
    foundMapRoute
      ? foundMapRoute
      : await _queryRoute(orig, dest)
  );
}

/**
 * Finds a perviously established map route between given origin and destination addresses.
 * @param orig The contact info (address) for the origin of the map route that is to be found.
 * @param dest The contact info (address) for the destination of the map route that is to be found.
 * @return A promise that resolves to the found map route. If not found, then it resolves to null.
 */
function _findMapRoute(orig: ContactInfo, dest: ContactInfo): Promise<MapRoute> {
  return getRepository(MapRouteEntity).createQueryBuilder('MapRoute').select().where(
    '"MapRoute"."startLocation" = ST_MAKEPOINT(:startLng, :startLat)::GEOGRAPHY', { startLng: orig.location.coordinates[0], startLat: orig.location.coordinates[1] }
  ).andWhere(
    '"MapRoute"."endLocation" = ST_MAKEPOINT(:endLng, :endLat)::GEOGRAPHY', { endLng: dest.location.coordinates[0], endLat: dest.location.coordinates[1] }
  ).getOne()
}

/**
 * Queries a 3rd party map service for the driving route.
 * @param orig The origin contact info (address).
 * @param dest The destination contact info (address).
 * @return A promise that resolves to the queried map route.
 */
async function _queryRoute(orig: ContactInfo, dest: ContactInfo): Promise<MapRoute> {
  const directions: Directions = await genDirections([orig, dest]);
  return {
    directions,
    distanceMi: directions.distanceMi,
    durationMin: directions.durationMin,
    endLocation: dest.location,
    startLocation: orig.location
  };
}
