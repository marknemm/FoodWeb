import express = require('express');
import { Request, Response } from 'express';
import { adminGenDevDataDump } from '~admin/services/admin-developer/admin-data-dump';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';

export const router = express.Router();

router.get('/dev-db', handleGetDevDb);
function handleGetDevDb(req: Request, res: Response) {
  adminGenDevDataDump()
    .then((devDumpPathname) => res.download(devDumpPathname))
    .catch(genErrorResponse.bind(this, res));
}
