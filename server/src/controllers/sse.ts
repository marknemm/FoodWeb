import express = require('express');
import { Request, Response } from 'express';
import { ensureSessionActive } from '../middlewares/session.middleware';
import { sseManager } from '../helpers/sse-manager';

const router = express.Router();

router.get('/', ensureSessionActive, (req: Request, res: Response) => {
  sseManager.addConnection(req, res);
});

module.exports = router;
