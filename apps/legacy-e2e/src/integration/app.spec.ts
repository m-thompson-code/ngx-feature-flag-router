import {
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
    interceptAngularModule,
} from '../support/app.po';

describe('demo', () => {
    beforeEach(() => cy.visit('/'));

    describe('root page', () => {
        it('should display root header', () => {
            const port = Cypress.env('PORT');

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

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
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);
        });

        it('should have sync-off header', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            // Function helper example, see `../support/app.po.ts` file
            getSyncOffHeader().contains('sync-off works!');
        });

        it('should lazy-load sync-off module and not sync-on module', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();

            interceptAngularModule('sync-off');
            interceptAngularModule('sync-on');

            cy.get('@sync-off-module').should('not.exist');

            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            cy.get('@sync-off-module').should('exist');
            cy.get('@sync-on-module').should('not.exist');
        });

        it('should navigate to async page', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);
        });

        it('should have async-off header', () => {
            const port = Cypress.env('PORT');

            getAsyncOffButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            // Function helper example, see `../support/app.po.ts` file
            getAsyncOffHeader().contains('async-off works!');
        });

        it('should lazy-load async-off module and not async-on module', () => {
            const port = Cypress.env('PORT');

            getAsyncOffButton().click();

            interceptAngularModule('async-off');
            interceptAngularModule('async-on');

            cy.get('@async-off-module').should('not.exist');

            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            cy.get('@async-off-module').should('exist');
            cy.get('@async-on-module').should('not.exist');
        });
    });

    describe('turning sync/async on (should be sync/async off)', () => {
        it('should navigate to sync page', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);
        });

        it('should have sync-on header', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            // Function helper example, see `../support/app.po.ts` file
            getSyncOnHeader().contains('sync-on works!');
        });

        it('should lazy-load sync-on module and not sync-on module', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();

            interceptAngularModule('sync-off');
            interceptAngularModule('sync-on');

            cy.get('@sync-on-module').should('not.exist');

            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            cy.get('@sync-on-module').should('exist');
            cy.get('@sync-off-module').should('not.exist');
        });

        it('should navigate to async page', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();

            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);
        });

        it('should have async-on header', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            // Function helper example, see `../support/app.po.ts` file
            getAsyncOnHeader().contains('async-on works!');
        });

        it('should lazy-load async-on module and not async-on module', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();

            interceptAngularModule('async-off');
            interceptAngularModule('async-on');

            cy.get('@async-on-module').should('not.exist');

            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            cy.get('@async-on-module').should('exist');
            cy.get('@async-off-module').should('not.exist');
        });
    });
});
