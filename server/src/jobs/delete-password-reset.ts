#!/usr/bin/env node
require('./jobs-config');
import { Connection, EntityManager, LessThanOrEqual } from 'typeorm';
import { PasswordResetEntity } from '../entity/password-reset';
import { initDbConnectionPool } from '../helpers/db-connection-pool';

_deletePasswordReset()
  .then(() => process.exit())
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });


async function _deletePasswordReset(): Promise<void> {
  const connection: Connection = await initDbConnectionPool();
  const nowMs = new Date().getTime();
  const fiveMinsAgo = new Date(nowMs - 150000);
  await connection.transaction(async (manager: EntityManager) => {
    await manager.getRepository(PasswordResetEntity).delete({
      createTimestamp: LessThanOrEqual(fiveMinsAgo)
    });
  });
}
