export const getRootHeader = () => cy.get('h1#root-header');
export const getSyncOffHeader = () => cy.get('h1#sync-off-header');
export const getSyncOnHeader = () => cy.get('h1#sync-on-header');
export const getAsyncOffHeader = () => cy.get('h1#async-off-header');
export const getAsyncOnHeader = () => cy.get('h1#async-on-header');

export const getRootAnchor = () => cy.get('a#root');
export const getSyncAnchor = () => cy.get('a#sync');
export const getAsyncAnchor = () => cy.get('a#async');

export const getSyncOffButton = () => cy.get('button#sync-off');
export const getAsyncOffButton = () => cy.get('button#async-off');
export const getSyncOnButton = () => cy.get('button#sync-on');
export const getAsyncOnButton = () => cy.get('button#async-on');

export const interceptAngularModule = (moduleName: string) => {
    const angularVersion = Cypress.env('ANGULAR_VERSION');
    const appPath = Cypress.env('APP_PATH');

    if (angularVersion <= 11) {
        cy.intercept('GET', `//${moduleName}-${moduleName}-module.js`).as(`${moduleName}-module`);
        return;
    }

    cy.intercept('GET', `//${appPath}_${moduleName}_${moduleName}_module_ts.js`).as(`${moduleName}-module`);
};
