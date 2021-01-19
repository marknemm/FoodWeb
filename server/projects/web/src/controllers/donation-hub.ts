import express = require('express');
import { Request, Response } from 'express';
import { AccountEntity } from '~entity';
import { DonationHub, DonationHubPledge, DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { genErrorResponse } from '~web/middlewares/response-error.middleware';
import { ensureSessionActive } from '~web/middlewares/session.middleware';
import { readDonationHub, readDonationHubs } from '~web/services/donation-hub/read-donation-hubs';
import { createDonationHub, updateDonationHub } from '~web/services/donation-hub/save-donation-hub';
import { createDonationHubPledge } from '~web/services/donation-hub-pledge/save-donation-hub-pledge';
import { deleteDonationHub } from '~web/services/donation-hub/delete-donation-hub';

export const router = express.Router();

router.get('/', handleGetDonationHubs);
export function handleGetDonationHubs(req: Request, res: Response) {
  const donationHubReq: DonationHubReadRequest = req.body;
  readDonationHubs(donationHubReq)
    .then((listRes: ListResponse<DonationHubEntity>) => res.send(listRes))
    .catch(genErrorResponse.bind(this, res));
}

router.get('/:id', handleGetDonationHub);
export function handleGetDonationHub(req: Request, res: Response) {
  const id: number = parseInt(req.params.id, 10);
  readDonationHub(id)
    .then((donationHub: DonationHubEntity) => res.send(donationHub))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/', ensureSessionActive, handlePostDonationHub);
export function handlePostDonationHub(req: Request, res: Response) {
  const donationHub: DonationHub = req.body;
  const account: AccountEntity = req.session.account;
  createDonationHub(donationHub, account)
    .then((savedDonationHub: DonationHubEntity) => res.send(savedDonationHub))
    .catch(genErrorResponse.bind(this, res));
}

router.post('/:id/pledge', ensureSessionActive, handlePostDonationHubPledge);
export function handlePostDonationHubPledge(req: Request, res: Response) {
  const donationHubId: number = parseInt(req.params.id, 10);
  const donationHubPledge: DonationHubPledge = req.body;
  const account: AccountEntity = req.session.account;
  createDonationHubPledge(donationHubPledge, donationHubId, account)
    .then((savedDonationHubPledge: DonationHubPledge) => res.send(savedDonationHubPledge))
    .catch(genErrorResponse.bind(this, res));
}

router.put('/:id', ensureSessionActive, handlePutDonationHub);
export function handlePutDonationHub(req: Request, res: Response) {
  const donationHub: DonationHub = req.body;
  const account: AccountEntity = req.session.account;
  updateDonationHub(donationHub, account)
    .then((savedDonationHub: DonationHubEntity) => res.send(savedDonationHub))
    .catch(genErrorResponse.bind(this, res));
}

router.delete('/:id', ensureSessionActive, handleDeleteDonationHub);
export function handleDeleteDonationHub(req: Request, res: Response) {
  const donationHubId: number = parseInt(req.params.id, 10);
  const account: AccountEntity = req.session.account;
  deleteDonationHub(donationHubId, account)
    .then((deletedDonationHub: DonationHubEntity) => res.send(deletedDonationHub))
    .catch(genErrorResponse.bind(this, res));
}
