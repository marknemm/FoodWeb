import { createConnection, Connection } from 'typeorm';
import path = require('path');

export function initPool(): Promise<Connection> {
  const entitiesPath: string = (process.env.DEVELOPMENT === 'true') ?
    path.join(__dirname, '..', 'entity', '*.ts') :
    path.join(__dirname, '..', 'entity', '*.js')
  console.log(entitiesPath);

  return createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [entitiesPath],
    synchronize: true
  });
}
