import {
    getAsyncAnchor,
    getAsyncOffButton,
    getAsyncOffHeader,
    getAsyncOnButton,
    getAsyncOnHeader,
    getRootAnchor,
    getRootHeader,
    getSyncAnchor,
    getSyncOffButton,
    getSyncOffHeader,
    getSyncOnButton,
    getSyncOnHeader,
    interceptAngularModule,
} from '../support/app.po';

describe('demo', () => {
    describe('root page', () => {
        it('should display root header', () => {
            cy.visit('/');

            const port = Cypress.env('PORT');

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            // Confirm that home page loads with root
            getRootHeader().contains('root works!');
        });

        it('should render with preloadable module eagerly preloading thanks to `PreloadAllNonFeatureFlagModules`', () => {
            const port = Cypress.env('PORT');

            interceptAngularModule('preloadable');
            interceptAngularModule('sync-off');
            interceptAngularModule('sync-on');

            cy.visit('/');

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            cy.get('@preloadable-module').should('exist');
            cy.get('@sync-off-module').should('not.exist');
            cy.get('@sync-on-module').should('not.exist');
        });
    });

    describe('no interaction', () => {
        it('should have sync-off header', () => {
            cy.visit('/');

            getSyncAnchor().click();

            // Confirm that navigating to sync page loads sync-off module by default
            getSyncOffHeader().contains('sync-off works!');
        });

        it('should have async-off header', () => {
            cy.visit('/');

            getAsyncAnchor().click();

            // Confirm that navigating to async page loads async-off module by default
            getAsyncOffHeader().contains('async-off works!');
        });
    });

    describe('turning sync/async off', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should navigate to sync page', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getSyncAnchor().click();

            // Confirm correct sync url for sync page
            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);
        });

        it('should have sync-off header', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            // Confirm that when sync feature flag is set to off,
            // sync-off page loads
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

            // Confirm that when sync feature flag is set to off,
            // sync-off module loads
            cy.get('@sync-off-module').should('exist');
            cy.get('@sync-on-module').should('not.exist');
        });

        it('should navigate to async page', () => {
            const port = Cypress.env('PORT');

            getSyncOffButton().click();
            getAsyncAnchor().click();

            // Confirm correct async url for async page
            cy.url().should('eq', `http://0.0.0.0:${port}/async`);
        });

        it('should have async-off header', () => {
            const port = Cypress.env('PORT');

            getAsyncOffButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            // Confirm that when async feature flag is set to off,
            // async-off page loads
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

            // Confirm that when async feature flag is set to off,
            // async-off module loads
            cy.get('@async-off-module').should('exist');
            cy.get('@async-on-module').should('not.exist');
        });
    });

    describe('turning sync/async on', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should navigate to sync page', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();
            getSyncAnchor().click();

            // Confirm correct sync url for sync page
            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);
        });

        it('should have sync-on header', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);

            // Confirm that when sync feature flag is set to on,
            // sync-on page loads
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

            // Confirm that when sync feature flag is set to on,
            // sync-on module loads
            cy.get('@sync-on-module').should('exist');
            cy.get('@sync-off-module').should('not.exist');
        });

        it('should navigate to async page', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();

            getAsyncAnchor().click();

            // Confirm correct async url for async page
            cy.url().should('eq', `http://0.0.0.0:${port}/async`);
        });

        it('should have async-on header', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);

            // Confirm that when async feature flag is set to on,
            // async-on page loads
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

            // Confirm that when async feature flag is set to on,
            // async-on module loads
            cy.get('@async-on-module').should('exist');
            cy.get('@async-off-module').should('not.exist');
        });
    });

    describe('navigating back and forth', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should properly navigate between sync pages given feature flag', () => {
            const port = Cypress.env('PORT');

            getSyncOnButton().click();

            interceptAngularModule('sync-off');
            interceptAngularModule('sync-on');

            cy.get('@sync-on-module').should('not.exist');

            getSyncOnButton().click();
            getSyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/sync`);
            getSyncOnHeader().contains('sync-on works!');

            cy.get('@sync-on-module').should('exist');
            cy.get('@sync-off-module').should('not.exist');

            getRootAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            getSyncOffButton().click();
            getSyncAnchor().click();

            getSyncOffHeader().contains('sync-off works!');
            cy.get('@sync-off-module').should('exist');

            getRootAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            getSyncOnButton().click();
            getSyncAnchor().click();

            getSyncOnHeader().contains('sync-on works!');
        });

        it('should properly navigate between async pages given feature flag', () => {
            const port = Cypress.env('PORT');

            getAsyncOnButton().click();

            interceptAngularModule('async-off');
            interceptAngularModule('async-on');

            cy.get('@async-on-module').should('not.exist');

            getAsyncOnButton().click();
            getAsyncAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/async`);
            getAsyncOnHeader().contains('async-on works!');

            cy.get('@async-on-module').should('exist');
            cy.get('@async-off-module').should('not.exist');

            getRootAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            getAsyncOffButton().click();
            getAsyncAnchor().click();

            getAsyncOffHeader().contains('async-off works!');
            cy.get('@async-off-module').should('exist');

            getRootAnchor().click();

            cy.url().should('eq', `http://0.0.0.0:${port}/`);

            getAsyncOnButton().click();
            getAsyncAnchor().click();

            getAsyncOnHeader().contains('async-on works!');
        });
    });
});
