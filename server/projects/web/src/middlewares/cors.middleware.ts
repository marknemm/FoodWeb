import { CorsOptions } from 'cors';
import { RequestHandler } from 'express';
import { env } from '~web/helpers/globals/env';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import corsInit = require('cors');

type OriginCallbackFn = (err: Error, allow?: boolean) => void;

const corsOpts: CorsOptions = {
  origin: (origin: string, callback: OriginCallbackFn) => {
    (!origin || env.DEVELOPMENT || env.CORS_WHITELIST.indexOf(origin) >= 0)
      ? callback(null, true)
      : callback(new FoodWebError(`Not allowed by CORS: ${origin}`, 302));
  },
  // This combined with 'withCredentials' option for XHR on client will enable cookie with request when using CORS.
  credentials: true
};

export const cors: RequestHandler = corsInit(corsOpts);
