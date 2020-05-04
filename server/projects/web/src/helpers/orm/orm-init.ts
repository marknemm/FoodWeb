import 'dotenv';
import { Connection, createConnection } from 'typeorm';
import path = require('path');

/**
 * Initializes the (TypeORM - PostgreSQL) database connection.
 * TypeORM will also implicitly setup entity mappings & run any needed migrations.
 * @return A promise that resolves to a generated connection.
 */
export function initOrm(): Promise<Connection> {
  const entitiesPath: string = path.join(global['serverDistDir'], 'database', 'src', 'entity', '*.js');
  const migrationsPath: string = path.join(global['serverDistDir'], 'database', 'src', 'migration', '*.js');
  console.log(entitiesPath);
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
