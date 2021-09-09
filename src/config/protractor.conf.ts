import { browser, Config } from 'protractor';
const argv = require('yargs').argv;
import { getCapabilities } from './helpers/capabilities';
import fs from 'fs-extra';
import path from 'path';

export const config: Config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [`${process.cwd()}/.jsrc/specs/**/*.specs.js`],
  capabilities: getCapabilities(),
  baseUrl: 'https://petstore.octoperf.com/actions/Catalog.action',
  directConnect: false,
  onPrepare: () => {
    // For non agular site
    browser.waitForAngularEnabled(false);
  },
  onComplete: () => {

  }
}