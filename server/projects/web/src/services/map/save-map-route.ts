import { MapRouteEntity } from 'database/src/entity/map-route.entity';
import { OrmEntityManager } from '~orm/index';
import { queryRoute } from '~web/helpers/map/directions';
import { ContactInfo, MapRoute } from '~shared';
import { findMapRoutesWithEndpoint } from './read-map-routes';

/**
 * Updates all cached map routes that contain oldEndpoint as one of their endpoints.
 * Changes oldEndpoint to newEndpoint, and recalculates directions, distance, & timings for the route.
 * @param oldEndpoint The old endpoint.
 * @param newEndpoint The new endpoint.
 * @param manager The optional entity manager used for the encompassing transaction.
 */
export async function updateMapRouteEndpoints(oldEndpoint: ContactInfo, newEndpoint: ContactInfo, manager?: OrmEntityManager): Promise<void> {
  const mapRoutesToUpdt: MapRoute[] = await findMapRoutesWithEndpoint(oldEndpoint);
  const updatedMapRoutes: MapRoute[] = [];

  for (let i = 0; i < mapRoutesToUpdt.length; i++) {
    updatedMapRoutes.push(
      await _refreshMapRoute(mapRoutesToUpdt[i], oldEndpoint, newEndpoint)
    );
  }

  await _saveMapRoutes(updatedMapRoutes, manager);
}

/**
 * Re-queries (3rd party service) a given map route based off of a given endpoint change.
 * @param mapRoute The map route to re-query.
 * @param oldEndpoint The old endpoint that shall be updated in the input mapRoute.
 * @param newEndpoint The new endpoint that oldEndpoint will be updated to.
 * @return A promise resolving to the re-queried map route.
 */
async function _refreshMapRoute(mapRoute: MapRoute, oldEndpoint: ContactInfo, newEndpoint: ContactInfo): Promise<MapRoute> {
  (mapRoute.startLocation.coordinates[0] === oldEndpoint.location.coordinates[0]
    && mapRoute.startLocation.coordinates[1] === oldEndpoint.location.coordinates[1])
      ? mapRoute.startLocation = newEndpoint.location
      : mapRoute.endLocation = newEndpoint.location;
  const updatedMapRoute: MapRoute = await queryRoute(mapRoute.startLocation, mapRoute.endLocation);
  updatedMapRoute.id = mapRoute.id;
  return updatedMapRoute;
}

/**
 * Saves (caches) a given list of map route(s).
 * @param mapRoutes The map route(s) that are to be saved.
 * @param manager The optional entity manager used for the encompassing transaction.
 */
async function _saveMapRoutes(mapRoutes: MapRoute[], manager: OrmEntityManager): Promise<MapRouteEntity[]> {
  return (manager)
    ? await manager.getRepository(MapRouteEntity).save(mapRoutes)
    : await OrmEntityManager.transaction((localManager: OrmEntityManager) =>
        localManager.getRepository(MapRouteEntity).save(mapRoutes)
    );
}
