import { getAsyncAnchor, getAsyncOffButton, getAsyncOffHeader, getAsyncOnButton, getAsyncOnHeader, getRootHeader, getSyncAnchor, getSyncOffButton, getSyncOffHeader, getSyncOnButton, getSyncOnHeader } from '../support/app.po';

describe('demo', () => {
    beforeEach(() => cy.visit('/'));

    it('should display welcome message', () => {
        // // Custom command example, see `../support/commands.ts` file
        // cy.login('my-email@something.com', 'myPassword');
        cy.url().should('eq', 'http://0.0.0.0:4200/');
        
        // Function helper example, see `../support/app.po.ts` file
        getRootHeader().contains('root works!');
    });

    describe('no interaction', () => {
        it('should navigate to sync-off page', () => {
            cy.window().its('__sync_feature_flag_state__').should('equal', undefined);

            getSyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getSyncOffHeader().contains('sync-off works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/sync');
        });

        it('should navigate to async-off page', () => {
            getAsyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getAsyncOffHeader().contains('async-off works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/async');
        });
    });

    describe('turning sync/async off', () => {
        it('should navigate to sync-off page', () => {
            getSyncOffButton().click();
            cy.window().its('__sync_feature_flag_state__').should('equal', false);

            getSyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getSyncOffHeader().contains('sync-off works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/sync');
        });

        it('should navigate to async-off page', () => {
            getAsyncOffButton().click();
            getAsyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getAsyncOffHeader().contains('async-off works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/async');
        });
    });

    describe('turning sync/async on', () => {
        it('should navigate to sync-on page', () => {
            getSyncOnButton().click();
            cy.window().its('__sync_feature_flag_state__').should('equal', true);

            getSyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getSyncOnHeader().contains('sync-on works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/sync');
        });

        it('should navigate to async-on page', () => {
            getAsyncOnButton().click();
            getAsyncAnchor().click();
            
            // Function helper example, see `../support/app.po.ts` file
            getAsyncOnHeader().contains('async-on works!');
            cy.url().should('eq', 'http://0.0.0.0:4200/async');
        });
    });
});
