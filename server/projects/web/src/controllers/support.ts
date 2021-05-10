import express = require('express');
import { Request, Response } from 'express';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { SupportInfo } from '../../../../../shared/src/web/interfaces/account/support-info';

export const router = express.Router();

router.get('/sendEmail', sendEmail);

export async function sendEmail(req: Request, res: Response) {
  const mailClient: MailClient = await getMailClient();
  const supportRequest: SupportInfo = req.query;

  mailClient.sendSupportEmail(
    MailTransporter.NOREPLY,
    supportRequest.email,
    supportRequest.subject,
    supportRequest.body
  ).catch(console.error);

  res.send({message: 'something'})
}
