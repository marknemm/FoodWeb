import { Connection, createConnection } from 'typeorm';
import { env } from '~web/helpers/globals/env';
import { appPaths } from '~web/helpers/globals/paths';
import { getReachableUrl } from '~web/helpers/misc/url';
import path = require('path');

/**
 * The initialized connection, which is kept to ensure that duplicate initialization does not occur.
 */
let connection: Connection;

/**
 * Initializes the (TypeORM - PostgreSQL) database connection.
 * TypeORM will also implicitly setup entity mappings & run any needed migrations.
 * @return A promise that resolves to a generated connection.
 */
export async function initOrm(): Promise<Connection> {
  if (!connection) { // Protect against accidental duplicate initialization.
    const entitiesPath: string = path.join(appPaths.serverDistDir, 'projects', 'web', 'src', 'database', 'entity', '*.js');
    const migrationsPath: string = path.join(appPaths.serverDistDir, 'projects', 'web', 'src', 'database', 'migration', '*.js');

    const dbHosts: string[] = [env.DATABASE_HOST, 'localhost', 'postgres'];
    const host: string = await getReachableUrl(dbHosts, env.DATABASE_PORT);

    connection = await createConnection({
      type: 'postgres',
      host,
      url: env.DATABASE_URL,
      port: env.DATABASE_PORT,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_DATABASE,
      entities: [entitiesPath],
      migrations: [migrationsPath],
      migrationsRun: env.DATABASE_MIGRATIONS_RUN && !env.ADMIN,
      synchronize: env.DATABASE_SYNC,
      logging: env.DATABASE_LOGGING,
      logger: env.DATABASE_LOGGER as any,
      ssl: env.DATABASE_SSL
        ? { rejectUnauthorized: (env.DATABASE_REJECT_UNAUTHORIZED ?? true) }
        : false
    }).catch((err) => {
      console.error('Error connecting to database');
      throw err;
    });
  }
  return connection;
}
