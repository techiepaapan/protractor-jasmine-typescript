import { $, $$, browser, ElementFinder } from 'protractor';
import * as commonHelpers from '../support/commonHelpers';
import * as waitFor from '../support/waitHelpers';
import * as elmList from '../support/elementList';
import expect from 'chai';
import { promisedExpect } from '../support/chai-imports';

describe('Protractor pet store site', () => {
    let breedLink: string;

    it('User navigates to pet store homepage.', async () => {
        await browser.get(browser.baseUrl);
        await commonHelpers.checkRedirectionToLink(browser.baseUrl);
        await promisedExpect(browser.getTitle()).to.eventually.equal('JPetStore Demo');
        await waitFor.elementVisible(elmList.PAGE_HEADER);
    });

    it('user clicks on dogs tab', async () => {
        await waitFor.elementVisible(elmList.PAGE_HEADER);
        await commonHelpers.elementAssertClick(elmList.DOGS_PAGE_LINK, 0, 'displayed');
    });

    it('user clicks on any breed', async () => {
        await commonHelpers.elementAssertClick(elmList.DOGS_PAGE_BREED, 0, 'displayed', '', '', false);
        breedLink = await $$(elmList.DOGS_PAGE_BREED).first().getAttribute('href');
        await $$(elmList.DOGS_PAGE_BREED).first().click();
    });

    it('user navigates to dog breed page', async () => {
        await commonHelpers.checkRedirectionToLink(breedLink);
        await waitFor.elementVisible(elmList.PAGE_HEADER);
    });

    it('user clicks on add to cart for any breed', async () => {
        await commonHelpers.elementAssertClick(elmList.LINK_BUTTON, 0, 'displayed', '', '', false);
        let addToCartElmNo: number = await commonHelpers.getMatchingTextElmNo(elmList.LINK_BUTTON, 'Add to cart');
        await commonHelpers.elementAssertClick(elmList.LINK_BUTTON, addToCartElmNo);
    });

    it('user navigates to shopping cart', async () => {
        await commonHelpers.elementAssertClick(elmList.CART_CONTAINER, 0, 'displayed', '', '', false);
    });

    it('user clicks on Proceed to Checkout button', async () => {
        await commonHelpers.elementAssertClick(elmList.LINK_BUTTON, 0, 'displayed', '', '', false);
        let checkoutElmNo: number = await commonHelpers.getMatchingTextElmNo(elmList.LINK_BUTTON, 'Proceed to Checkout');
        await commonHelpers.elementAssertClick(elmList.LINK_BUTTON, checkoutElmNo);
        await browser.sleep(3000);
    });
});