import { $$, $, element, by, browser, ElementFinder, protractor } from "protractor";
import * as elmList from './elementList';
import * as waitFor from './waitHelpers';
import { expect } from 'chai';
import { promisedExpect } from './chai-imports';
const support = require('protractor-firefox-support');

/**
 * Retrieve current page URL.
 * @param returnLowerCaseURL Should return URl in lowercase? Default: false
 * @returns 
 */
export const getPageUrl = async (returnLowerCaseURL: boolean = false): Promise<string> => {
    let currentUrl = await browser.getCurrentUrl();
    return returnLowerCaseURL ? currentUrl.toLowerCase() : currentUrl;
}


/**
 * Deletes browser cookies, session storage and local storage.
 */
export const deleteAllBrowserData = async (): Promise<any> => {
    // Promise take a max 1.5s to resolve
    return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve(1);
        }, 1500);
        try {
            await browser.executeScript(`
            var cookies = document.cookie.split("; ");
            for (var c = 0; c < cookies.length; c++) {
                var d = window.location.hostname.split(".");
                while (d.length > 0) {
                    var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + d.join('.') + ' ;path=';
                    var p = location.pathname.split('/');
                    document.cookie = cookieBase + '/';
                    while (p.length > 0) {
                        document.cookie = cookieBase + p.join('/');
                        p.pop();
                    };
                    d.shift();
                }
            }`);
            await browser.manage().deleteAllCookies();
            await browser.executeScript('window.sessionStorage.clear();');
            await browser.executeScript('window.localStorage.clear();');
            await browser.executeScript('document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"); });');
        } catch (error) { }

        clearTimeout(timeout);
        resolve(1);
    });
}


/**
 * Scroll to the element using protractor tag name.
 * @param elm  Element/Tag name. Example : 'input[class="wishlists__input"]'.
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToView = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (browser.params.browserName === 'ie') {
            await browser.executeScript(`document.getElementsByTagName('${elm}')[${elmNumber}].scrollIntoView(false)`);
        }
        else {
            await browser.executeScript(`document.getElementsByTagName('${elm}')[${elmNumber}].scrollIntoView({ behavior: '${browser.params.browserName === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.sleep(1000);
    } catch (error) { }
};


/**
 * Scroll to the element using element's class attribute.
 * @param elm lass name. Example : "wishlists__input".
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToViewClass = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (browser.params.browserName === 'ie') {
            await browser.executeScript(`document.getElementsByClassName('${elm}')[${elmNumber}].scrollIntoView(false)`);
        }
        else {
            await browser.executeScript(`document.getElementsByClassName('${elm}')[${elmNumber}].scrollIntoView({ behavior: '${browser.params.browserName === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.sleep(1000);
    } catch (error) { }
};


/**
 * Scroll to the element using element's ID attribute.
 * @param elm ID name. Example : "eq-equipmentName".
 * @param elmNumber Element number. Default value is 0.
 */
export const scrollToViewID = async (elm: string, elmNumber: number = 0): Promise<void> => {
    try {
        if (browser.params.browserName === 'ie') {
            await browser.executeScript(`document.getElementById('${elm}').scrollIntoView(false)`);
        }
        else {
            await browser.executeScript(`document.getElementById('${elm}').scrollIntoView({ behavior: '${browser.params.browserName === 'chrome' ? 'smooth' : 'auto'}', block: 'nearest', inline: 'start' })`);
        }
        await browser.sleep(1000);
    } catch (error) { }
};


/**
 * Creates a unique string using timestamp and random text.
 */
export const uniqueString = (): string => {
    let result: string = '';
    result = Math.random().toString(36).substring(2, 9);
    result = new Date().getTime().toString() + result;
    return result;
}


/**
 * Removes keyboard focus from the current element.
 */
export const blurActiveElement = async (): Promise<void> => {
    await browser.executeScript('document.activeElement.blur()').catch(err => { });
    await browser.sleep(500);
}


/**
 * Checks if browser has navigated to specified URL.
 * @param link Example: google.com
 */
export const checkRedirectionToLink = async (link: string) => {
    await waitFor.urlContains(link);
    const url: string = await getPageUrl();
    expect(url.includes(link), `${link} does not exists in URL ${url}`).to.be.true;
}


/**
 * Get the element number of first visible element in viewport/screen.
 * @param elmName Element Name. Value = 'input[class="wishlists__input"]'.
 * @returns Element
 */
export const getVisibleElmNo = async (elmName: string): Promise<number> => {
    const elementCount: number = await $$(elmName).count();
    let elmNo: number = 0;
    for (let i: number = 0; i < elementCount; ++i) {
        const isDisplayed: boolean = await $$(elmName).get(i).isDisplayed();
        if (isDisplayed) {
            elmNo = i;
            break;
        }
    }
    return elmNo;
}


/**
 * Get the element number of element with matching string.
 * @param elmName Element identifier string.
 * @param matchText String to match with getText of expected element.
 * @param matchType equals | includes | endsWith. Default: equals
 * @param assert true | false. Default: true
 */
export const getMatchingTextElmNo = async (elmName: string, matchText: string, matchType: string = 'equals', assert: boolean = true): Promise<number> => {
    const elementCount: number = await $$(elmName).count();
    matchText =matchText.trim().toLowerCase();
    let elmNo: number = 0;
    for (let i: number = 0; i < elementCount; ++i) {
        const elmText: string = (await $$(elmName).get(i).getText()).trim().toLowerCase();
        if (matchType === 'equals') {
            if (elmText === matchText) {
                elmNo = i;
                break;
            }
        }
        else if (matchType === 'includes') {
            if (elmText.includes(matchText)) {
                elmNo = i;
                break;
            }
        }
        else if (matchType === 'endsWith') {
            if (elmText.endsWith(matchText)) {
                elmNo = i;
                break;
            }
        }
        else {
            throw new Error("Unknown matchType parameter passed");
        }
    }

    if (assert) {
        const elmText: string = (await $$(elmName).get(elmNo).getText()).trim().toLowerCase();
        if (matchType === 'equals') {
            expect(elmText).to.equal(matchText);
        }
        else if (matchType === 'includes') {
            expect(elmText).to.include(matchText);
        }
        else if (matchType === 'endsWith') {
            expect(elmText.endsWith(matchText), `Text "${elmText}" do not ends with "${matchText}"`).to.be.true;
        }
    }
    return elmNo;
}


/**
 * Retrieve browser name.
 */
export const getBrowserName = async (): Promise<string> => {
    const browserCap = await browser.getCapabilities();
    return browserCap.get('browserName');
}


/**
 * Function to wait, scroll to, assert and click the defined element.
 * @param elm Element identifier string
 * @param elmNo Element number. Default: 0
 * @param assertType present | enabled | displayed. Default: enabled
 * @param elmClassName HTML class name of an element. Default: ''
 * @param elmID  HTML ID name of an element. Default: ''
 * @param clickElement Should click on element? Default: true
 * @param assertElement Default: true
 */
export const elementAssertClick = async (elm: string, elmNo: number = 0, assertType: string = 'enabled', elmClassName: string = '', elmID: string = '', clickElement: boolean = true, assertElement: boolean = true): Promise<void> => {
    await waitFor.elementPresent(elm, elmNo);

    // Scroll to element
    if (elmClassName !== '') {
        await scrollToViewClass(elmClassName, elmNo);
    }
    else if (elmID !== '') {
        await scrollToViewID(elmID, elmNo);
    }
    else {
        await scrollToView(elm, elmNo);
    }

    // Assertion. No assertion if assertType value is set to ''(empty)
    if (assertType === 'enabled') {
        await waitFor.elementEnabled(elm, elmNo);
        if (assertElement) {
            await promisedExpect($$(elm).get(elmNo).isPresent(), `Element not present!: [${elm}]`).to.eventually.equal(true);
            await promisedExpect($$(elm).get(elmNo).isEnabled(), `Element not enabled!: [${elm}]`).to.eventually.equal(true);
        }
    }
    else if (assertType === 'displayed') {
        await waitFor.elementVisible(elm, elmNo);
        if (assertElement) {
            await promisedExpect($$(elm).get(elmNo).isPresent(), `Element not present!: [${elm}]`).to.eventually.equal(true);
            await promisedExpect($$(elm).get(elmNo).isDisplayed(), `Element not visible!: [${elm}]`).to.eventually.equal(true);
        }
    }
    else if (assertType === 'present') {
        await promisedExpect($$(elm).get(elmNo).isPresent(), `Element not present!: [${elm}]`).to.eventually.equal(true);
    }

    //Click element if condition true
    if (clickElement) {
        try {
            if (browser.params.browserName === 'safari') {
                await jsClickElm(elm, elmNo);
            }
            else {
                await $$(elm).get(elmNo).click();
            }
        } catch (error: any) { console.log(error.message); }
    }
}

/**
 * Function to click element.
 * 
 * For macOS/OS X, vanilla javascript functionality will be used to click.
 * 
 * @param elm Element. Ex. $$('#btn").first()
 */
export const clickElm = async (elm: ElementFinder): Promise<void> => {
    if (browser.params.browserName === 'safari') {
        await browser.executeScript('arguments[0].click()', elm).catch((err: Error) => { throw new Error(err.message); });
    }
    else {
        await elm.click();
    }
}


/**
 * Plain JavaScript function to click on an element.
 * @param selector Selector value as string. Ex: div[class="name"]
 * @param elmNo Default 0.
 */
export const jsClickElm = async (selector: string, elmNo: number = 0): Promise<void> => {
    await browser.executeScript(`document.querySelectorAll('${selector}')[${elmNo}].click()`).catch((err: Error) => { throw new Error("Click Error!\n" + err.message); });
}


/**
 * Plain JavaScript function to focus on an element.
 * @param selector Selector value as string. Ex: div[class="name"]
 * @param elmNo Default 0.
 */
export const jsFocusElm = async (selector: string, elmNo: number = 0): Promise<void> => {
    await browser.executeScript(`document.querySelectorAll('${selector}')[${elmNo}].focus()`).catch((err: Error) => { throw new Error("Cannot focus on element!"); });;
}


/**
 * Get current domain name.
 * Default domain is "com"
 */
export const getCurrentDomain = (): string => {
    let domain: string = "com";
    if (browser.params.domainName) {
        if (browser.params.domainName !== "") {
            domain = browser.params.domainName;
        }
    }
    return domain;
}


/**
 * Get current environment name. Expected values: dev, stage, prod.
 * @returns dev | stage | prod. Default: stage
 */
export const getEnv = (): string => {
    const baseUrl: string = browser.baseUrl;
    let env: string = 'stage';
    // Code to get current environment here...
    return env;
}


/**
 * Function to disintegrate a string and then push it into an input field.
 * @param elm Web Element
 * @param customText Text to enter into the input box
 */
export const crumbledInput = async (elm: ElementFinder, customText: string): Promise<void> => {
    const arr = Array.from(customText);
    for (let i = 0; i < arr.length; i++) {
        await elm.sendKeys(arr[i]);
    }
    await browser.sleep(500);
}


/**
 * Function to execute mouse actions on an element.
 * 
 * @param elm Element
 * @param actionType up, down, move. Default: move
 * @param shouldClick true or false. Default: false
 * @param removeAllFocus Remove focus from all the elements? Default: true
 */
export const mouseAction = async (elm: ElementFinder, actionType: string = "move", shouldClick: boolean = false, removeAllFocus: boolean = true): Promise<void> => {
    if (removeAllFocus) {
        await blurActiveElement();
    }
    const isElmPresent: boolean = await elm.isPresent();
    if (!isElmPresent) {
        return;
    }
    let location: any;
    if (browser.params.browserName === 'firefox') {
        location = await elm.getLocation();
    }
    switch (actionType) {
        case "down":
            if (browser.params.browserName === 'firefox') {
                await browser.executeScript(support.mouseMove, { x: location.x, y: location.y }).catch(err => { });
            }
            else {
                try { await browser.actions().mouseDown(elm).perform(); } catch (err) { }
            }
            break;

        case "up":
            if (browser.params.browserName === 'firefox') {
                await browser.executeScript(support.mouseUp, { x: location.x, y: location.y }).catch(err => { });
            }
            else {
                try { await browser.actions().mouseUp(elm).perform(); } catch (err) { }
            }
            break;

        default:
            if (browser.params.browserName === 'firefox') {
                await browser.executeScript(support.mouseMove, { x: location.x, y: location.y }).catch(err => { });
            }
            else {
                try { await browser.actions().mouseMove(elm).perform(); } catch (err) { }
            }
    }

    if (shouldClick) {
        await clickElm(elm);
    }
}


/**
 * Function to get keys for different keyboard functions.
 * @param keyType "cut", "copy","paste"
 * @returns An object containing 2 keys for protractor
 */
export const getKeyboardKeys = async (keyType: string): Promise<any> => {
    interface Controls {
        key1: any
        key2: any
    }
    const controls: Controls = { key1: '', key2: '' }
    if (browser.params.osx) {
        switch (keyType.toLowerCase()) {
            case "copy": controls.key1 = protractor.Key.CONTROL, controls.key2 = protractor.Key.INSERT;
                break;
            case "paste": controls.key1 = protractor.Key.SHIFT, controls.key2 = protractor.Key.INSERT;
                break;
            case "cut": controls.key1 = protractor.Key.SHIFT, controls.key2 = protractor.Key.DELETE;
                break;
        }
    }
    else {
        switch (keyType.toLowerCase()) {
            case "copy": controls.key1 = protractor.Key.CONTROL, controls.key2 = 'c';
                break;
            case "paste": controls.key1 = protractor.Key.CONTROL, controls.key2 = 'v';
                break;
            case "cut": controls.key1 = protractor.Key.CONTROL, controls.key2 = 'x';
                break;
        }
    }
    return controls;
}
