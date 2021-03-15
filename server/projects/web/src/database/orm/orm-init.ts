import 'dotenv';
import { Connection, createConnection } from 'typeorm';
import { getReachableUrl } from '~web/helpers/misc/url';
import path = require('path');

/**
 * Initializes the (TypeORM - PostgreSQL) database connection.
 * TypeORM will also implicitly setup entity mappings & run any needed migrations.
 * @return A promise that resolves to a generated connection.
 */
export async function initOrm(): Promise<Connection> {
  const entitiesPath: string = path.join(global['serverDistDir'], 'projects', 'web', 'src', 'database', 'entity', '*.js');
  const migrationsPath: string = path.join(global['serverDistDir'], 'projects', 'web', 'src', 'database', 'migration', '*.js');

  const port: number = (process.env.DATABASE_PORT)
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432;

  const dbHosts: string[] = [process.env.DATABASE_HOST, 'localhost', 'postgres'];
  const host: string = await getReachableUrl(dbHosts, port);

  return createConnection({
    type: 'postgres',
    host,
    port,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsRun: (process.env.DATABASE_SYNC !== 'true'),
    synchronize: (process.env.DATABASE_SYNC === 'true'),
    logging: (process.env.DATABASE_LOGGING === 'true'),
    logger: process.env.DATABASE_LOGGER as any,
    ssl: (process.env.DATABASE_SSL === 'true')
      ? { rejectUnauthorized: (process.env.DATABASE_REJECT_UNAUTHORIZED === 'true') }
      : false
  });
}
