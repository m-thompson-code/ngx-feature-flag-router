import {
    getAngularModule,
    getAsyncAnchor,
    getAsyncOffButton,
    getAsyncOffHeader,
    getAsyncOnButton,
    getAsyncOnHeader,
    getRootHeader,
    getSyncAnchor,
    getSyncOffButton,
    getSyncOffHeader,
    getSyncOnButton,
    getSyncOnHeader,
} from '../support/app.po';

describe('demo', () => {
    beforeEach(() => cy.visit('/'));

    describe('root page', () => {
        it('should display root header', () => {
            cy.url().should('eq', 'http://0.0.0.0:4200/');

            // Function helper example, see `../support/app.po.ts` file
            getRootHeader().contains('root works!');
        });
    });

    describe('no interaction', () => {
        it('should have sync-off header', () => {
            getSyncAnchor().click();

            // Function helper example, see `../support/app.po.ts` file
            getSyncOffHeader().contains('sync-off works!');
        });

        it('should have async-off header', () => {
            getAsyncAnchor().click();

            // Function helper example, see `../support/app.po.ts` file
            getAsyncOffHeader().contains('async-off works!');
        });
    });

    describe('turning sync/async off', () => {
        it('should navigate to sync page', () => {
            getSyncOffButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/sync');
        });

        it('should have sync-off header', () => {
            getSyncOffButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/sync');

            // Function helper example, see `../support/app.po.ts` file
            getSyncOffHeader().contains('sync-off works!');
        });

        it('should lazy-load sync-off module and not sync-on module', () => {
            getSyncOffButton().click();

            getAngularModule('sync-off');
            getAngularModule('sync-on');

            cy.get('@sync-off-module').should('not.exist');

            getSyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/sync');

            cy.get('@sync-off-module').should('exist');
            cy.get('@sync-on-module').should('not.exist');
        });

        it('should navigate to async page', () => {
            getSyncOffButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/async');
        });

        it('should have async-off header', () => {
            getAsyncOffButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/async');

            // Function helper example, see `../support/app.po.ts` file
            getAsyncOffHeader().contains('async-off works!');
        });

        // it('should lazy-load async-off module and not async-on module', () => {
        //     getAsyncOffButton().click();

        //     interceptAsyncOffModule();
        //     interceptAsyncOnModule();

        //     cy.get('@async-off-module').should('not.exist');

        //     getAsyncAnchor().click();

        //     cy.url().should('eq', 'http://0.0.0.0:4200/async');

        //     cy.get('@async-off-module').should('exist');
        //     cy.get('@async-on-module').should('not.exist');
        // });
    });

    describe('turning sync/async on (should be sync/async off)', () => {
        it('should navigate to sync page', () => {
            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/sync');
        });

        it('should have sync-on header', () => {
            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/sync');

            // Function helper example, see `../support/app.po.ts` file
            getSyncOnHeader().contains('sync-on works!');
        });

        // it('should lazy-load sync-on module and not sync-on module', () => {
        //     getSyncOnButton().click();

        //     interceptSyncOffModule();
        //     interceptSyncOnModule();

        //     cy.get('@sync-on-module').should('not.exist');

        //     getSyncOnButton().click();
        //     getSyncAnchor().click();

        //     cy.url().should('eq', 'http://0.0.0.0:4200/sync');

        //     cy.get('@sync-on-module').should('exist');
        //     cy.get('@sync-off-module').should('not.exist');
        // });

        it('should navigate to async page', () => {
            getAsyncOnButton().click();

            getAsyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/async');
        });

        it('should have async-on header', () => {
            getAsyncOnButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', 'http://0.0.0.0:4200/async');

            // Function helper example, see `../support/app.po.ts` file
            getAsyncOnHeader().contains('async-on works!');
        });

        // it('should lazy-load async-on module and not async-on module', () => {
        //     getAsyncOnButton().click();

        //     interceptAsyncOffModule();
        //     interceptAsyncOnModule();

        //     cy.get('@async-on-module').should('not.exist');

        //     getAsyncAnchor().click();

        //     cy.url().should('eq', 'http://0.0.0.0:4200/async');

        //     cy.get('@async-on-module').should('exist');
        //     cy.get('@async-off-module').should('not.exist');
        // });
    });
});
