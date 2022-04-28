export const getRootHeader = () => cy.get('h1#root-header');
export const getSyncOffHeader = () => cy.get('h1#sync-off-header');
export const getSyncOnHeader = () => cy.get('h1#sync-on-header');
export const getAsyncOffHeader = () => cy.get('h1#async-off-header');
export const getAsyncOnHeader = () => cy.get('h1#async-on-header');

export const getSyncAnchor = () => cy.get('a#sync');

export const getAsyncAnchor = () => cy.get('a#async');

export const getSyncOffButton = () => cy.get('button#sync-off');

export const getAsyncOffButton = () => cy.get('button#async-off');

export const getSyncOnButton = () => cy.get('button#sync-on');

export const getAsyncOnButton = () => cy.get('button#async-on');

// spy on POST requests to /users endpoint
export const interceptSyncOffModule = () =>
    cy.intercept('GET', '//apps_legacy_src_app_sync-off_sync-off_module_ts.js').as('sync-off-module');

// spy on POST requests to /users endpoint
export const interceptAsyncOffModule = () =>
    cy.intercept('GET', '//apps_legacy_src_app_async-off_async-off_module_ts.js').as('async-off-module');
