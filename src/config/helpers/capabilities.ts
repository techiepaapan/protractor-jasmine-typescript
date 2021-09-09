const argv = require('yargs').argv;
import os from 'os';
import { Config } from 'protractor';

let platformName: string = os.platform();
const platformVersion: string = os.release();
if (platformName == "darwin") {
    platformName = "osx";
} else if (platformName == "win32" || platformName == "win64") {
    platformName = "windows";
}

const caps = {
    chrome: {
        browserName: 'chrome',
        chromeOptions: {
            // args: ["--no-sandbox", "--disable-gpu", "--headless"],
        },
        shardTestFiles: true,
        maxInstances: 1,
        deviceProperties: {
            browser: {
                name: 'chrome',
                version: 'latest'
            },
            platform: {
                name: platformName,
                version: platformVersion
            }
        }
    },
    firefox: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
            // args: ["--headless"],
        },
        shardTestFiles: true,
        maxInstances: 1,
        deviceProperties: {
            browser: {
                name: 'firefox',
                version: 'latest'
            },
            platform: {
                name: platformName,
                version: platformVersion
            }
        }
    },
    edge: {
        browserName: 'MicrosoftEdge',
        shardTestFiles: true,
        maxInstances: 1, // Recommended: 1, Maximum: 2
        deviceProperties: {
            browser: {
                name: 'MicrosoftEdge',
                version: 'latest'
            },
            platform: {
                name: platformName,
                version: platformVersion
            }
        }
    }
}

/**
 * Retrieve browser capability for protractor.
 * @returns Capability array.
 */
export const getCapabilities = () => {
    if (argv.browserName) {
        if (argv.browserName === 'firefox') {
            return caps.firefox;
        }
        else if (argv.browserName === 'edge') {
            return caps.edge;
        }
        else {
            throw new Error("Invalid browser name!");
        }
    }
    return caps.chrome;
}