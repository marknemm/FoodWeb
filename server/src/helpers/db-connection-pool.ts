import { createConnection, Connection } from 'typeorm';
import path = require('path');

export function initDbConnectionPool(): Promise<Connection> {
  const entitiesPath: string = path.join(__dirname, '..', 'entity', '*.js');
  const migrationsPath: string = path.join(__dirname, '..', 'migration', '*.js');
  return createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsRun: (process.env.DATABASE_SYNC !== 'true'),
    synchronize: (process.env.DATABASE_SYNC === 'true'),
    logging: (process.env.DATABASE_LOGGING === 'true'),
    logger: process.env.DATABASE_LOGGER as any
  });
}
