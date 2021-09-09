import { browser, protractor, element, by, ElementFinder, $, $$ } from 'protractor';

/**
 * Function to wait for browser to be navigated to expected URL.
 * @param expectedUrl Expected URL
 * @param timeout Default: 30000
 */
export const url = async (expectedUrl: string, timeout: number = 30000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = EC.urlIs(expectedUrl);
        await browser.wait(condition, timeout, '[URL] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Function to wait for browser to be navigated to the URL which contains the expected URL.
 * @param expectedUrl Expected URL
 * @param timeout Default: 30000
 */
export const urlContains = async (expectedUrl: string, timeout: number = 30000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = EC.urlContains(expectedUrl);
        await browser.wait(condition, timeout, '[URL] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Function to wait for an element to be present.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const elementPresent = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = xpath ?
            EC.presenceOf(element.all(by.xpath(expectedElement)).get(elmNo))
            : EC.presenceOf($$(expectedElement).get(elmNo));
        await browser.wait(condition, timeout, '[Element][' + expectedElement + '] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Function to wait for an element to be enabled.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const elementVisible = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = xpath ?
            EC.visibilityOf(element.all(by.xpath(expectedElement)).get(elmNo))
            : EC.visibilityOf($$(expectedElement).get(elmNo));
        await browser.wait(condition, timeout, '[Element][' + expectedElement + '] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Function to wait for an element to be visible.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const elementEnabled = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = xpath ?
            EC.elementToBeClickable(element.all(by.xpath(expectedElement)).get(elmNo))
            : EC.elementToBeClickable($$(expectedElement).get(elmNo));
        await browser.wait(condition, timeout, '[Element][' + expectedElement + '] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Function to wait for an element to be not visible.
 * @param expectedElement Element identifier string
 * @param elmNo Element Number. Default: 0
 * @param xpath Is element string is an xpath. Default: false
 * @param timeout Default: 10000
 */
export const elementNotVisible = async (expectedElement: string, elmNo: number = 0, xpath = false, timeout: number = 10000): Promise<void> => {
    const EC = protractor.ExpectedConditions;
    try {
        let condition = xpath ?
            EC.not(EC.visibilityOf(element.all(by.xpath(expectedElement)).get(elmNo)))
            : EC.not(EC.visibilityOf($$(expectedElement).get(elmNo)));
        await browser.wait(condition, timeout, '[Element][' + expectedElement + '] Timeout!!! Condition not satisfied!');
    } catch (err) { }
}


/**
 * Funcction to check if an element contains an expected string.
 * @param elm Element. Ex: $('p[class="label"]')
 * @param expectedText Expected string in a given element 
 * @param timeout Default: 20000 (20s)
 */
export const elementContainsText = async (elm: ElementFinder, expectedText: string, timeout: number = 20000): Promise<void> => {
    try {
        await browser.wait(async () => {
            const isElementPresent = await elm.isPresent();
            if (!isElementPresent) { return false; }
            const text: string = (await elm.getText()).trim().toLowerCase();
            return text.includes(expectedText);
        }, timeout, `Element do not have text "${expectedText}"`);
    } catch (err) { }
}
