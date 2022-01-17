import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '~entity';
import { DonationHub, DonationHubPledge, DonationHubPledgeReadRequest, DonationHubReadRequest } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { genErrorResponse } from '~web/middleware/response-error.middleware';
import { ensureSessionActive } from '~web/middleware/session.middleware';
import { deleteDonationHubPledge } from '~web/services/donation-hub-pledge/delete-donation-hub-pledge';
import { sendDonationHubPledgeDeleteMessages } from '~web/services/donation-hub-pledge/delete-donation-hub-pledge-message';
import { readDonationHubPledge, readDonationHubPledges, readMyDonationHubPledges, readMyPledgeUnderDonationHub, readPledgesUnderDonationHub } from '~web/services/donation-hub-pledge/read-donation-hub-pledges';
import { createDonationHubPledge, updateDonationHubPledge } from '~web/services/donation-hub-pledge/save-donation-hub-pledge';
import { sendDonationHubPledgeCreateMessages } from '~web/services/donation-hub-pledge/save-donation-hub-pledge-message';
import { deleteDonationHub } from '~web/services/donation-hub/delete-donation-hub';
import { sendDonationHubDeleteMessages } from '~web/services/donation-hub/delete-donation-hub-messages';
import { sendDonationHubAvailableMessages } from '~web/services/donation-hub/donation-hub-available-message';
import { readDonationHub, readDonationHubs, readMyDonationHubs } from '~web/services/donation-hub/read-donation-hubs';
import { createDonationHub, updateDonationHub } from '~web/services/donation-hub/save-donation-hub';
import { sendDonationHubCreateMessages } from '~web/services/donation-hub/save-donation-hub-message';

export const router = express.Router();

router.get('/', handleGetDonationHubs);
export async function handleGetDonationHubs(req: Request, res: Response) {
  const donationHubReq: DonationHubReadRequest = req.query;
  const account: AccountEntity = req.session?.account;

  try {
    res.send(await readDonationHubs(donationHubReq, account));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/my', ensureSessionActive, handleGetMyDonationHubs);
export async function handleGetMyDonationHubs(req: Request, res: Response) {
  const donationHubReq: DonationHubReadRequest = req.query;
  const account: AccountEntity = req.session.account;

  try {
    res.send(await readMyDonationHubs(donationHubReq, account));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/pledge', handleGetDonationHubPledges);
export async function handleGetDonationHubPledges(req: Request, res: Response) {
  const donationHubPledgeReq: DonationHubPledgeReadRequest = req.query;

  try {
    res.send(await readDonationHubPledges(donationHubPledgeReq));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/pledge/my', ensureSessionActive, handleGetMyDonationHubPledges);
export async function handleGetMyDonationHubPledges(req: Request, res: Response) {
  const donationHubPledgeReq: DonationHubPledgeReadRequest = req.query;
  const account: AccountEntity = req.session.account;

  try {
    res.send(await readMyDonationHubPledges(donationHubPledgeReq, account));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/pledge/:id', handleGetDonationHubPledge);
export async function handleGetDonationHubPledge(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);

  try {
    res.send(await readDonationHubPledge(id));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/:id', handleGetDonationHub);
export async function handleGetDonationHub(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);

  try {
    res.send(await readDonationHub(id));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/:id/pledge', handleGetPledgesUnderDonationHub);
export async function handleGetPledgesUnderDonationHub(req: Request, res: Response) {
  const donationHubPledgeReq: DonationHubPledgeReadRequest = req.query;
  const donationHubId: number = parseInt(req.params.id, 10);

  try {
    res.send(await readPledgesUnderDonationHub(donationHubId, donationHubPledgeReq));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.get('/:id/pledge/my', ensureSessionActive, handleGetMyPledgeUnderDonationHub);
export async function handleGetMyPledgeUnderDonationHub(req: Request, res: Response) {
  const donationHubId: number = parseInt(req.params.id, 10);
  const account: AccountEntity = req.session.account;

  try {
    res.send(await readMyPledgeUnderDonationHub(donationHubId, account));
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.post('/', ensureSessionActive, handlePostDonationHub);
export async function handlePostDonationHub(req: Request, res: Response) {
  const donationHub: DonationHub = req.body;
  const account: AccountEntity = req.session.account;

  try {
    const savedDonationHub: DonationHubEntity = await createDonationHub(donationHub, account);
    sendDonationHubCreateMessages(savedDonationHub); // Do not wait for message(s) to be sent, simply kick-off the process.
    sendDonationHubAvailableMessages(savedDonationHub);
    res.send(savedDonationHub);
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.post('/:id/pledge', ensureSessionActive, handlePostDonationHubPledge);
export async function handlePostDonationHubPledge(req: Request, res: Response) {
  const donationHubId: number = parseInt(req.params.id, 10);
  const donationHubPledge: DonationHubPledge = req.body;
  const account: AccountEntity = req.session.account;

  try {
    const savedPledge: DonationHubPledgeEntity = await createDonationHubPledge(donationHubPledge, account, donationHubId);
    sendDonationHubPledgeCreateMessages(savedPledge); // Do not wait for the message(s) to be sent, simply kick-off the process.
    res.send(savedPledge);
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.put('/pledge/:id', ensureSessionActive, handlePutDonationHubPledge);
export async function handlePutDonationHubPledge(req: Request, res: Response) {
  const pledge: DonationHubPledge = req.body;
  const account: AccountEntity = req.session.account;

  try {
    const savedPledge: DonationHubPledgeEntity = await updateDonationHubPledge(pledge, account);
    res.send(savedPledge);
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.put('/:id', ensureSessionActive, handlePutDonationHub);
export async function handlePutDonationHub(req: Request, res: Response) {
  const donationHub: DonationHub = req.body;
  const account: AccountEntity = req.session.account;

  try {
    const savedDonationHub: DonationHubEntity = await updateDonationHub(donationHub, account);
    res.send(savedDonationHub);
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.delete('/pledge/:id', ensureSessionActive, handleDeleteDonationHubPledge);
export async function handleDeleteDonationHubPledge(req: Request, res: Response) {
  const donationHubPledgeId: number = parseInt(req.params.id, 10);
  const account: AccountEntity = req.session.account;

  try {
    const pledge: DonationHubPledgeEntity = await deleteDonationHubPledge(donationHubPledgeId, account);
    sendDonationHubPledgeDeleteMessages(pledge); // Do not wait for the message(s) to be sent, simply kick-off the process.
    res.send(pledge);
  } catch (err) {
    genErrorResponse(res, err);
  }
}

router.delete('/:id', ensureSessionActive, handleDeleteDonationHub);
export async function handleDeleteDonationHub(req: Request, res: Response) {
  const donationHubId: number = parseInt(req.params.id, 10);
  const account: AccountEntity = req.session.account;

  try {
    const donationHub: DonationHubEntity = await readDonationHub(donationHubId);
    // Send delete messages/notifications before deleting the donation hub so pledges can be queried in paginated manner.
    await sendDonationHubDeleteMessages(donationHub);
    await deleteDonationHub(donationHubId, account);
    res.send(donationHub); // Respond with the deleted donation drop-off hub.
  } catch (err) {
    genErrorResponse(res, err);
  }
}
