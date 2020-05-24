import express = require('express');
import { Request, Response } from 'express';
import { genDevDataDump } from '~admin/services/developer/data-dump';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';

export const router = express.Router();

router.get('/dev-db', handleGetDevDb);
function handleGetDevDb(req: Request, res: Response) {
  genDevDataDump()
    .then((devDumpPathname) => res.download(devDumpPathname))
    .catch(genErrorResponse.bind(this, res));
}