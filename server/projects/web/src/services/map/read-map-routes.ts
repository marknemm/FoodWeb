import { plainToClass } from 'class-transformer';
import { getRepository } from 'typeorm';
import { MapRouteEntity } from '~entity';
import { MapRouteEndpoint, queryRoute, routeEndpointToLocation } from '~web/helpers/map/directions';
import { ContactInfo, MapRoute } from '~shared';

/**
 * Generates a map route for a route segment between two addresses contained within a given donation (e.g. volunteer -> donor, donor -> receiver).
 * @param orig The origin contact info (address) of the route that is to be generated.
 * @param dest The destination contact info (address) of the route that is to be generated.
 * @return A promise that resolves to the generated map route.
 */
export async function genMapRoute(orig: MapRouteEndpoint, dest: MapRouteEndpoint): Promise<MapRouteEntity> {
  const foundMapRoute: MapRoute = await findMapRoute(orig, dest);
  return plainToClass(
    MapRouteEntity,
    foundMapRoute
      ? foundMapRoute
      : await queryRoute(orig, dest)
  );
}

/**
 * Finds a perviously established map route between given origin and destination addresses.
 * @param orig The contact info (address) for the origin of the map route that is to be found.
 * @param dest The contact info (address) for the destination of the map route that is to be found.
 * @return A promise that resolves to the found map route. If not found, then it resolves to null.
 */
export function findMapRoute(orig: MapRouteEndpoint, dest: MapRouteEndpoint): Promise<MapRoute> {
  return getRepository(MapRouteEntity).createQueryBuilder('MapRoute').select().where(
    '"MapRoute"."startLocation" = ST_MAKEPOINT(:startLng, :startLat)::GEOGRAPHY', {
      startLng: routeEndpointToLocation(orig).coordinates[0],
      startLat: routeEndpointToLocation(orig).coordinates[1]
    }
  ).andWhere(
    '"MapRoute"."endLocation" = ST_MAKEPOINT(:endLng, :endLat)::GEOGRAPHY', {
      endLng: routeEndpointToLocation(dest).coordinates[0],
      endLat: routeEndpointToLocation(dest).coordinates[1]
    }
  ).getOne()
}

/**
 * Find all map routes that include a given endpoint (origin or destination point).
 * @param endpoint The contact info (address) endpoint to look for among map route endpoints.
 * @return A promise that resolves to the found map routes. If none were found, then it resolves to an empty array.
 */
export function findMapRoutesWithEndpoint(endpoint: ContactInfo): Promise<MapRoute[]> {
  return getRepository(MapRouteEntity).createQueryBuilder('MapRoute').select().where(
    '"MapRoute"."startLocation" = ST_MAKEPOINT(:startLng, :startLat)::GEOGRAPHY', {
      startLng: endpoint.location.coordinates[0],
      startLat: endpoint.location.coordinates[1]
    }
  ).orWhere(
    '"MapRoute"."endLocation" = ST_MAKEPOINT(:endLng, :endLat)::GEOGRAPHY', {
      endLng: endpoint.location.coordinates[0],
      endLat: endpoint.location.coordinates[1]
    }
  ).getMany();
}
