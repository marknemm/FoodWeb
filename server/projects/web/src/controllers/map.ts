import express = require('express');
import { Request, Response } from 'express';
import { MapRouteEntity } from '~entity';
import { genErrorResponse } from '~web/middleware/response-error.middleware';
import { genMapRoute } from '~web/services/map/read-map-routes';
import { MapRouteReadRequest } from '~shared';

export const router = express.Router();

router.get('/route', handleGetMapRoute);
export function handleGetMapRoute(req: Request<any, any, any, MapRouteReadRequest>, res: Response) {
  const request: MapRouteReadRequest = req.query;
  genMapRoute(
    { coordinates: [Number.parseFloat(request.origLng), Number.parseFloat(request.origLat)], type: 'Point' },
    { coordinates: [Number.parseFloat(request.destLng), Number.parseFloat(request.destLat)], type: 'Point' }
  ).then((mapRoute: MapRouteEntity) => {
    res.send(mapRoute);
  }).catch(genErrorResponse.bind(this, res));
}
