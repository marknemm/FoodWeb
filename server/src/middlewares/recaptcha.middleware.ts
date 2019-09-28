import 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { RecaptchaV3 } from 'express-recaptcha';
import { RecaptchaResponseDataV3 } from 'express-recaptcha/dist/interfaces';

const _recaptchaEnabled = (process.env.RECAPTCHA_ENABLED === 'true');
const _recaptchaRequired = (process.env.RECAPTCHA_REQUIRED === 'true');
const _recaptchaScoreMin = parseFloat(process.env.RECAPTCHA_SCORE_MIN);
const _recpatchaV3 = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

/**
 * RECAPTCHA (v3) middleware that ensures that the received form data has not been submitted by a bot.
 * @param request The request from the client (holds any active session data).
 * @param response The response to the client.
 * @param next A callback that when called will execute the next route handler.
 */
export function recaptcha(request: Request, response: Response, next: NextFunction): void {
  const reqBody: any = request.body; // Save actual request body to forward and process later.

  // If RECAPTCHA is not enabled in server environment configs, then simply go to next handler.
  if (request.method === 'GET' || !_recaptchaEnabled || (reqBody.recaptchaScore == null && !_recaptchaRequired)) {
    return next();
  }

  // If we are sent form data from some autonomous system or bot, it will be rejected.
  request.body = { 'g-recaptcha-response': reqBody.recaptchaScore }
  _recpatchaV3.verify(request, (err: string, data: RecaptchaResponseDataV3) => {
    if (!err) {
      request.body = reqBody;
      request.body.recaptchaScore = data.score;
      if (!_recaptchaScoreMin || data.score >= _recaptchaScoreMin) {
        return next();
      }
    }
    _handleRejection(response, err);
  });
}

function _handleRejection(response: Response, err?: string) {
  if (err) { console.error(err); }
  response.status(500).send({ message: 'Request rejected due to failed reCAPTCHA test.' })
}
