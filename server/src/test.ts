import * as chai from 'chai';
import * as server from '../src/server';
import chaiHttp = require('chai-http');
import { logger } from '../src/logging/logger';

chai.use(chaiHttp);
const should: Chai.Should = chai.should();
const expect: Chai.ExpectStatic = chai.expect;
export { chai, server, should, expect };

// Turn off logging for testing.
logger.transports.forEach((transport) => {
  transport.level = 'error';
});
