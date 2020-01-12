import express = require('express');
import { Request, Response } from 'express';
import { GeneralStats } from '../interfaces/heuristics/general-stats';
import { genErrorResponse } from '../middlewares/response-error.middleware';
import { readGeneralStats } from '../services/heuristics/read-general-stats';

const router = express.Router();

router.get('/general-stats', (req: Request, res: Response) => {
  readGeneralStats()
    .then((stats: GeneralStats) => res.send(stats))
    .catch(genErrorResponse.bind(this, res));
});

module.exports = router;
