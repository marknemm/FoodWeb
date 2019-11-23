import express = require('express');
import { Request, Response } from 'express';
import { GeneralStats } from '../interfaces/heuristics/general-stats';
import { handleError } from '../middlewares/response-error.middleware';
import { readGeneralStats } from '../services/read-general-stats';

const router = express.Router();

router.get('/general-stats', (req: Request, res: Response) => {
  readGeneralStats()
    .then((stats: GeneralStats) => res.send(stats))
    .catch(handleError.bind(this, res));
});

module.exports = router;
