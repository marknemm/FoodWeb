import express = require('express');
import { Request, Response } from 'express';
import { GeneralStats } from '~shared';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { readGeneralStats } from '~web/services/heuristics/read-general-stats';

export const router = express.Router();

router.get('/general-stats', handleGetGeneralStats);
export function handleGetGeneralStats(req: Request, res: Response) {
  readGeneralStats()
    .then((stats: GeneralStats) => res.send(stats))
    .catch(genErrorResponse.bind(this, res));
}
