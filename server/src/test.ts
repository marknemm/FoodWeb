import * as chai from 'chai';
import * as server from './index';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should: Chai.Should = chai.should();
const expect: Chai.ExpectStatic = chai.expect;
export { chai, server, should, expect };

