import chai from 'chai';
import cap from 'chai-as-promised';

chai.use(cap);

export const promisedExpect = chai.expect;
