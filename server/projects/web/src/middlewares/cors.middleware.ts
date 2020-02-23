import { CorsOptions } from 'cors';
import 'dotenv';
import { RequestHandler } from 'express';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import corsInit = require('cors');

type OriginCallbackFn = (err: Error, allow?: boolean) => void;

const corsWhitelist: string[] = (process.env.CORS_WHITELIST)
  ? process.env.CORS_WHITELIST.split(',')
  : [];

const corsOpts: CorsOptions = {
  origin: (origin: string, callback: OriginCallbackFn) => {
    (!origin || corsWhitelist.indexOf(origin) >= 0)
      ? callback(null, true)
      : callback(new FoodWebError('Not allowed by CORS', 302));
  },
  // This combined with 'withCredentials' option for XHR on client will enable cookie with request when using CORS.
  credentials: true
};

export const cors: RequestHandler = corsInit(corsOpts);
